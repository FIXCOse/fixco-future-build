import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { viewportConfig } from "@/utils/scrollAnimations";

const professions = ["Snickare", "Elektriker", "VVS", "Målare", "Trädgård", "Städ", "Montering", "Markarbeten", "Flytt"];
const availabilities = ["Heltid", "Deltid", "Projekt", "Flexibelt"];

const formSchema = z.object({
  first_name: z.string().min(2, "Förnamn krävs"),
  last_name: z.string().min(2, "Efternamn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().min(10, "Telefonnummer krävs"),
  date_of_birth: z.string().min(1, "Födelsedatum krävs"),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  profession: z.string().min(1, "Välj yrke"),
  experience_years: z.number().min(0, "Ange antal år"),
  has_drivers_license: z.boolean().default(false),
  has_own_tools: z.boolean().default(false),
  has_company: z.boolean().default(false),
  company_name: z.string().optional(),
  org_number: z.string().optional(),
  availability: z.string().min(1, "Välj tillgänglighet"),
  preferred_start_date: z.string().optional(),
  motivation: z.string().min(50, "Beskriv varför du vill jobba hos oss (minst 50 tecken)"),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  gdpr_consent: z.boolean().refine(val => val === true, "Du måste godkänna GDPR"),
  marketing_consent: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export const ApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      has_drivers_license: false,
      has_own_tools: false,
      has_company: false,
      gdpr_consent: false,
      marketing_consent: false,
    }
  });

  const hasCompany = form.watch("has_company");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let cvFilePath = null;

      // Upload CV if provided
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}-${data.email}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('job-applications')
          .upload(fileName, cvFile);

        if (uploadError) throw uploadError;
        cvFilePath = uploadData.path;
      }

      // Insert application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          ...data,
          cv_file_path: cvFilePath,
          skills: [],
          certificates: [],
          work_references: [],
        });

      if (insertError) throw insertError;

      // Send confirmation email
      await supabase.functions.invoke('send-application-email', {
        body: {
          to: data.email,
          applicantName: `${data.first_name} ${data.last_name}`,
          status: 'confirmation'
        }
      });

      toast.success("Tack för din ansökan!", {
        description: "Vi har tagit emot din ansökan och återkommer inom kort."
      });

      form.reset();
      setCvFile(null);
      setStep(1);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error("Något gick fel", {
        description: "Kunde inte skicka ansökan. Försök igen senare."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ['first_name', 'last_name', 'email', 'phone', 'date_of_birth']
      : step === 2
      ? ['profession', 'experience_years', 'availability']
      : [];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep(step + 1);
  };

  return (
    <section id="application-form" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Ansök till Fixco</CardTitle>
              <CardDescription>
                Steg {step} av 3 - {step === 1 ? "Personuppgifter" : step === 2 ? "Yrkesuppgifter" : "Motivation & Samtycke"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4"
                      >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Förnamn *</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Efternamn *</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-post *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefon *</FormLabel>
                              <FormControl>
                                <Input placeholder="070-123 45 67" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Födelsedatum *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adress</FormLabel>
                            <FormControl>
                              <Input placeholder="Gatugatan 123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postnummer</FormLabel>
                              <FormControl>
                                <Input placeholder="123 45" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stad</FormLabel>
                              <FormControl>
                                <Input placeholder="Stockholm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                        <Button type="button" onClick={nextStep} className="w-full">
                          Nästa steg
                        </Button>
                      </motion.div>
                    )}

                    {/* Step 2: Professional Info */}
                    {step === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4"
                      >
                      <FormField
                        control={form.control}
                        name="profession"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yrke *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Välj yrke" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {professions.map(prof => (
                                  <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience_years"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Antal års erfarenhet *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0"
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tillgänglighet *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Välj tillgänglighet" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availabilities.map(avail => (
                                  <SelectItem key={avail} value={avail}>{avail}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferred_start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Önskat startdatum</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="has_drivers_license"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Har körkort (B)</FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="has_own_tools"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Har egna verktyg</FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="has_company"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Driver eget företag (F-skatt)</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      {hasCompany && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                          <FormField
                            control={form.control}
                            name="company_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Företagsnamn</FormLabel>
                                <FormControl>
                                  <Input placeholder="Mitt AB" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="org_number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organisationsnummer</FormLabel>
                                <FormControl>
                                  <Input placeholder="556677-8899" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <div>
                        <FormLabel>Ladda upp CV (valfritt)</FormLabel>
                        <div className="mt-2 flex items-center gap-4">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                            className="cursor-pointer"
                          />
                          {cvFile && (
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              {cvFile.name}
                            </span>
                          )}
                        </div>
                        <FormDescription>PDF eller Word-dokument (max 5MB)</FormDescription>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="linkedin_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn (valfritt)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://linkedin.com/in/..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="portfolio_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Portfolio/Hemsida (valfritt)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                          Tillbaka
                        </Button>
                        <Button type="button" onClick={nextStep} className="flex-1">
                          Nästa steg
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Motivation & Consent */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="motivation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Varför vill du jobba för Fixco? *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Berätta om dig själv och varför du passar hos Fixco..." 
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>Minst 50 tecken</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4 p-4 bg-muted rounded-lg">
                        <FormField
                          control={form.control}
                          name="gdpr_consent"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  Jag godkänner att Fixco behandlar mina personuppgifter enligt GDPR *
                                </FormLabel>
                                <FormDescription>
                                  Dina uppgifter behandlas konfidentiellt och används endast för rekrytering
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="marketing_consent"
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  Jag vill få information om framtida jobbmöjligheter
                                </FormLabel>
                                <FormDescription>
                                  Du kan när som helst avsluta prenumerationen
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                          Tillbaka
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Skickar...
                            </>
                          ) : (
                            'Skicka ansökan'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  </AnimatePresence>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
