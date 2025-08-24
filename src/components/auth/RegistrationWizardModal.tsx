import { useState } from "react";
import AuthModal from "./AuthModal";
import { RegistrationWizard } from "./RegistrationWizard";

interface RegistrationWizardModalProps {
  open: boolean;
  onClose: () => void;
}

export function RegistrationWizardModal({ open, onClose }: RegistrationWizardModalProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <AuthModal open={open} onClose={onClose}>
      <RegistrationWizard onClose={onClose} onSuccess={handleSuccess} />
    </AuthModal>
  );
}