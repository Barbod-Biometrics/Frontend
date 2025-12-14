"use client";

import React, { useState,useEffect } from 'react';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/ui/Button';
import { validateEmail } from './validation';
import { CONTACT_LABELS } from './constants';

interface EditEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export function EditEmailModal({
  isOpen,
  onClose,
  currentEmail,
  onSubmit,
  isLoading
}: EditEmailModalProps) {
  const [email, setEmail] = useState(currentEmail);
  const [error, setError] = useState<string>('');

  useEffect(() => {
  setEmail(currentEmail); 
  setError(''); 
}, [currentEmail]);

  const handleSubmit = async () => {
    const validationError = validateEmail(email);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    await onSubmit(email);
    onClose();
  };

  const handleClose = () => {
    setEmail(currentEmail);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="ویرایش ایمیل"
      size="lg"
    >
      <div className="space-y-8"> 
        <Input
          label={CONTACT_LABELS.email}
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            setError('');
          }}
          error={error}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          placeholder="example@domain.com"
          className="h-12 text-base"
          dir="ltr" 
          style={{ textAlign: 'left' }} 
          autoFocus
        />
        
        <div className="flex gap-4 pt-6"> 
          <Button
            variant="secondary"
            onClick={handleClose}
            className="flex-1 h-12" 
            disabled={isLoading}
          >
            {CONTACT_LABELS.cancel}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1 h-12"
            disabled={isLoading}
          >
            {isLoading ? CONTACT_LABELS.saving : CONTACT_LABELS.save}
          </Button>
        </div>
      </div>
    </Modal>
  );
}