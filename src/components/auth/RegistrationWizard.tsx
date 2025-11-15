import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AccountTypeSelector } from "./AccountTypeSelector";
import { formatOrgNo, isValidSwedishOrgNo, normalizeOrgNo } from "@/helpers/orgno";
import { formatPostcode, isValidSwedishPostcode, normalizePostcode } from "@/helpers/postcode";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, User, Building, MapPin, FileText } from "lucide-react";

type AccountType = "private" | "company" | "brf";

interface WizardFormData {
  // Step 1 - Account
  email: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  
  // Step 2 - Details
  firstName?: string;
  lastName?: string;
  phone: string;
  companyName?: string;
  companyOrgNo?: string;
  brfName?: string;
  brfOrgNo?: string;
  contactPerson?: string;
  
  // Step 3 - Address
  street: string;
  postcode: string;
  city: string;
  unit?: string;
  notes?: string;
}

interface RegistrationWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function RegistrationWizard({ onClose, onSuccess }: RegistrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<WizardFormData>({
    defaultValues: {
      accountType: "private",
      termsAccepted: false,
      privacyAccepted: false,
    },
    mode: "onChange"
  });

  const { register, setValue, watch, formState: { errors, isValid }, trigger, handleSubmit } = form;
  const watchedValues = watch();

  const steps = [
    { number: 1, title: "Konto", icon: User },
    { number: 2, title: "Uppgifter", icon: Building },
    { number: 3, title: "Adress", icon: MapPin },
    { number: 4, title: "Granska", icon: FileText },
  ];

  const isStepValid = async (step: number): Promise<boolean> => {
    const fields = {
      1: ['email', 'password', 'confirmPassword'],
      2: watchedValues.accountType === 'private' 
        ? ['firstName', 'lastName', 'phone']
        : ['phone', 'contactPerson', ...(watchedValues.accountType === 'company' ? ['companyName', 'companyOrgNo'] : ['brfName', 'brfOrgNo'])],
      3: ['street', 'postcode', 'city'],
      4: []
    };

    return await trigger(fields[step] as any);
  };

  const nextStep = async () => {
    const valid = await isStepValid(currentStep);
    if (valid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: WizardFormData) => {
    if (currentStep < 4) return;
    
    setIsSubmitting(true);
    try {
      // Step 1: Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            account_type: data.accountType,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            company_name: data.companyName,
            org_number: data.accountType === 'company' ? normalizeOrgNo(data.companyOrgNo || '') : normalizeOrgNo(data.brfOrgNo || ''),
            brf_name: data.brfName,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');

      // Step 2: Update profile with address data
      await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: data.email,
          user_type: data.accountType,
          full_name: data.accountType === 'private' ? `${data.firstName} ${data.lastName}` : data.contactPerson,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          address_line: data.street,
          postal_code: normalizePostcode(data.postcode),
          city: data.city,
          company_name: data.companyName,
          org_number: data.accountType === 'company' ? normalizeOrgNo(data.companyOrgNo || '') : data.accountType === 'brf' ? normalizeOrgNo(data.brfOrgNo || '') : null,
          brf_name: data.brfName,
        }, { onConflict: 'id' });

      // Step 3: Create organization if needed
      let organizationId = null;
      if (data.accountType !== 'private') {
        const orgData = {
          name: data.accountType === 'company' ? data.companyName! : data.brfName!,
          org_no: normalizeOrgNo(data.accountType === 'company' ? data.companyOrgNo! : data.brfOrgNo!),
          type: data.accountType,
          contact_email: data.email,
          contact_phone: data.phone,
        };

        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .upsert(orgData, { onConflict: 'org_no' })
          .select()
          .single();

        if (orgError) throw orgError;
        organizationId = org.id;

        // Add user as admin to organization
        await supabase
          .from('organization_members')
          .upsert({
            organization_id: organizationId,
            user_id: authData.user.id,
            role: 'admin'
          });
      }

      // Step 4: Create property
      const propertyData = {
        name: `${data.accountType === 'private' ? 'Hem' : (data.accountType === 'company' ? 'Företag' : 'BRF')} - ${data.street}`,
        address: data.street,
        postal_code: normalizePostcode(data.postcode),
        city: data.city,
        type: 'villa' as const, // Default to villa, can be changed later
        notes: data.notes || null,
        ...(data.accountType === 'private' 
          ? { owner_id: authData.user.id }
          : { organization_id: organizationId }
        )
      };

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (propertyError) throw propertyError;

      toast({
        title: "Kontot har skapats!",
        description: "Kontrollera din e-post för att verifiera ditt konto.",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registrering misslyckades",
        description: error.message || "Ett fel uppstod under registreringen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors text-xs
                  ${isActive ? 'bg-primary border-primary text-primary-foreground' : 
                    isCompleted ? 'bg-primary/10 border-primary text-primary' : 
                    'bg-muted border-muted-foreground/20 text-muted-foreground'}
                `}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`ml-2 text-xs font-medium hidden sm:inline ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-2 sm:mx-4 h-0.5 w-4 sm:w-8 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && <Step1Content form={form} />}
              {currentStep === 2 && <Step2Content form={form} />}
              {currentStep === 3 && <Step3Content form={form} />}
              {currentStep === 4 && <Step4Content watchedValues={watchedValues} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between p-6 border-t bg-background/50">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center"
            >
              Fortsätt
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? "Skapar konto..." : "Slutför & skapa konto"}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Step1Content({ form }: { form: any }) {
  const { register, setValue, watch, formState: { errors } } = form;
  const accountType = watch("accountType");
  const password = watch("password");
  const termsAccepted = watch("termsAccepted");
  const privacyAccepted = watch("privacyAccepted");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Skapa ditt konto</h2>
        <p className="text-muted-foreground">Välj kontotyp och ange inloggningsuppgifter</p>
      </div>

      <div>
        <Label>Kontotyp</Label>
        <AccountTypeSelector
          value={accountType}
          onChange={(value) => setValue("accountType", value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">E-post *</Label>
          <Input
            {...register("email", {
              required: "E-post krävs",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Ogiltig e-postadress"
              }
            })}
            type="email"
            placeholder="din@email.se"
          />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="password">Lösenord *</Label>
          <Input
            {...register("password", {
              required: "Lösenord krävs",
              minLength: {
                value: 6,
                message: "Minst 6 tecken"
              }
            })}
            type="password"
            placeholder="Minst 6 tecken"
          />
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message as string}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Bekräfta lösenord *</Label>
        <Input
          {...register("confirmPassword", {
            required: "Bekräfta ditt lösenord",
            validate: value => value === password || "Lösenorden matchar inte"
          })}
          type="password"
          placeholder="Ange lösenordet igen"
        />
        {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message as string}</p>}
      </div>

      <div className="space-y-3">
        <label className="flex items-start space-x-2">
          <input
            {...register("termsAccepted", { required: "Du måste acceptera användarvillkoren" })}
            type="checkbox"
            className="mt-0.5"
          />
          <span className="text-sm">
            Jag accepterar <Link to="/terms" className="text-primary hover:underline">användarvillkoren</Link> *
          </span>
        </label>
        {errors.termsAccepted && <p className="text-destructive text-xs">{errors.termsAccepted.message as string}</p>}

        <label className="flex items-start space-x-2">
          <input
            {...register("privacyAccepted", { required: "Du måste acceptera personuppgiftspolicyn" })}
            type="checkbox"
            className="mt-0.5"
          />
          <span className="text-sm">
            Jag accepterar <Link to="/privacy" className="text-primary hover:underline">personuppgiftspolicyn</Link> *
          </span>
        </label>
        {errors.privacyAccepted && <p className="text-destructive text-xs">{errors.privacyAccepted.message as string}</p>}
      </div>
    </div>
  );
}

function Step2Content({ form }: { form: any }) {
  const { register, setValue, watch, formState: { errors } } = form;
  const accountType = watch("accountType");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dina uppgifter</h2>
        <p className="text-muted-foreground">
          {accountType === 'private' && "Ange dina personuppgifter"}
          {accountType === 'company' && "Ange företagsuppgifter"}
          {accountType === 'brf' && "Ange BRF-uppgifter"}
        </p>
      </div>

      {accountType === 'private' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Förnamn *</Label>
            <Input
              {...register("firstName", { required: "Förnamn krävs" })}
              placeholder="Ditt förnamn"
            />
            {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message as string}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Efternamn *</Label>
            <Input
              {...register("lastName", { required: "Efternamn krävs" })}
              placeholder="Ditt efternamn"
            />
            {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message as string}</p>}
          </div>
        </div>
      )}

      {accountType === 'company' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Företagsnamn *</Label>
            <Input
              {...register("companyName", { required: "Företagsnamn krävs" })}
              placeholder="Ditt företags namn"
            />
            {errors.companyName && <p className="text-destructive text-xs mt-1">{errors.companyName.message as string}</p>}
          </div>
          
          <div>
            <Label htmlFor="companyOrgNo">Org.nr (företag) *</Label>
            <Input
              {...register("companyOrgNo", {
                required: "Org.nr krävs för företag",
                validate: (value) => isValidSwedishOrgNo(value) || "Ogiltigt organisationsnummer",
                onChange: (e) => setValue("companyOrgNo", formatOrgNo(e.target.value))
              })}
              inputMode="numeric"
              placeholder="556016-0680"
            />
            <p className="text-muted-foreground text-xs mt-1">
              10 siffror, t.ex. 556016-0680. Vi formaterar automatiskt.
            </p>
            {errors.companyOrgNo && <p className="text-destructive text-xs">{errors.companyOrgNo.message as string}</p>}
          </div>
        </div>
      )}

      {accountType === 'brf' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="brfName">BRF-namn *</Label>
            <Input
              {...register("brfName", { required: "BRF-namn krävs" })}
              placeholder="BRF namn"
            />
            {errors.brfName && <p className="text-destructive text-xs mt-1">{errors.brfName.message as string}</p>}
          </div>
          
          <div>
            <Label htmlFor="brfOrgNo">Org.nr (BRF) *</Label>
            <Input
              {...register("brfOrgNo", {
                required: "Org.nr krävs för BRF",
                validate: (value) => isValidSwedishOrgNo(value) || "Ogiltigt organisationsnummer",
                onChange: (e) => setValue("brfOrgNo", formatOrgNo(e.target.value))
              })}
              inputMode="numeric"
              placeholder="769601-1234"
            />
            <p className="text-muted-foreground text-xs mt-1">
              10 siffror, t.ex. 769601-XXXX. Vi formaterar automatiskt.
            </p>
            {errors.brfOrgNo && <p className="text-destructive text-xs">{errors.brfOrgNo.message as string}</p>}
          </div>
        </div>
      )}

      {accountType !== 'private' && (
        <div>
          <Label htmlFor="contactPerson">Kontaktperson *</Label>
          <Input
            {...register("contactPerson", { required: "Kontaktperson krävs" })}
            placeholder="Namn på kontaktperson"
          />
          {errors.contactPerson && <p className="text-destructive text-xs mt-1">{errors.contactPerson.message as string}</p>}
        </div>
      )}

      <div>
        <Label htmlFor="phone">Telefon *</Label>
        <Input
          {...register("phone", {
            required: "Telefonnummer krävs",
            pattern: {
              value: /^\+?\d[\d\s-]{6,}$/,
              message: "Ogiltigt telefonnummer"
            }
          })}
          type="tel"
          placeholder="+46 79 335 02 28"
        />
        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message as string}</p>}
      </div>
    </div>
  );
}

function Step3Content({ form }: { form: any }) {
  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Adressuppgifter</h2>
        <p className="text-muted-foreground">Ange din primära adress för tjänster</p>
      </div>

      <div>
        <Label htmlFor="street">Gatuadress *</Label>
        <Input
          {...register("street", { required: "Gatuadress krävs" })}
          placeholder="Exempelgatan 123"
        />
        {errors.street && <p className="text-destructive text-xs mt-1">{errors.street.message as string}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postcode">Postnummer *</Label>
          <Input
            {...register("postcode", {
              required: "Postnummer krävs",
              validate: (value) => isValidSwedishPostcode(value) || "Ogiltigt postnummer",
              onChange: (e) => setValue("postcode", formatPostcode(e.target.value))
            })}
            inputMode="numeric"
            placeholder="123 45"
          />
          <p className="text-muted-foreground text-xs mt-1">5 siffror, t.ex. 123 45</p>
          {errors.postcode && <p className="text-destructive text-xs">{errors.postcode.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="city">Ort *</Label>
          <Input
            {...register("city", { required: "Ort krävs" })}
            placeholder="Stockholm"
          />
          {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message as string}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="unit">Lägenhet/trapp (valfritt)</Label>
        <Input
          {...register("unit")}
          placeholder="Lgh 1001, trapp A"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notering (valfritt)</Label>
        <Textarea
          {...register("notes")}
          placeholder="T.ex. portlås, parkeringsinfo..."
          rows={3}
        />
      </div>
    </div>
  );
}

function Step4Content({ watchedValues }: { watchedValues: WizardFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Granska dina uppgifter</h2>
        <p className="text-muted-foreground">Kontrollera att allt är korrekt innan du skapar kontot</p>
      </div>

      <div className="space-y-4">
        <div className="card-premium p-4">
          <h3 className="font-semibold mb-2">Konto</h3>
          <p className="text-sm">
            <span className="text-muted-foreground">E-post:</span> {watchedValues.email}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Typ:</span> {
              watchedValues.accountType === 'private' ? 'Privat' :
              watchedValues.accountType === 'company' ? 'Företag' : 'BRF'
            }
          </p>
        </div>

        <div className="card-premium p-4">
          <h3 className="font-semibold mb-2">Uppgifter</h3>
          {watchedValues.accountType === 'private' ? (
            <div>
              <p className="text-sm">
                <span className="text-muted-foreground">Namn:</span> {watchedValues.firstName} {watchedValues.lastName}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Telefon:</span> {watchedValues.phone}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm">
                <span className="text-muted-foreground">
                  {watchedValues.accountType === 'company' ? 'Företag:' : 'BRF:'}
                </span> {watchedValues.companyName || watchedValues.brfName}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Org.nr:</span> {watchedValues.companyOrgNo || watchedValues.brfOrgNo}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Kontaktperson:</span> {watchedValues.contactPerson}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Telefon:</span> {watchedValues.phone}
              </p>
            </div>
          )}
        </div>

        <div className="card-premium p-4">
          <h3 className="font-semibold mb-2">Adress</h3>
          <p className="text-sm">{watchedValues.street}</p>
          {watchedValues.unit && <p className="text-sm">{watchedValues.unit}</p>}
          <p className="text-sm">{watchedValues.postcode} {watchedValues.city}</p>
          {watchedValues.notes && (
            <p className="text-sm text-muted-foreground mt-2">{watchedValues.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}