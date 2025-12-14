"use client";

import React, { useState,useEffect } from 'react';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/ui/Button';
import { validatePhone } from './validation';
import { CONTACT_LABELS } from './constants';

interface EditPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
  onSubmit: (phone: string) => Promise<void>;
  isLoading: boolean;
}

export function EditPhoneModal({
  isOpen,
  onClose,
  currentPhone,
  onSubmit,
  isLoading
}: EditPhoneModalProps) {
  const [phone, setPhone] = useState(currentPhone);
  const [error, setError] = useState<string>('');

 useEffect(() => {
    setPhone(currentPhone); 
    setError('');
  }, [currentPhone]);

  const handleSubmit = async () => {
    const validationError = validatePhone(phone);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    await onSubmit(phone);
    onClose();
  };

  const handleClose = () => {
    setPhone(currentPhone);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="ویرایش شماره تلفن"
      size="lg"
    >
      <div className="space-y-8"> 
        <Input
          label={CONTACT_LABELS.phone}
          type="tel"
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPhone(e.target.value);
            setError('');
          }}
          error={error}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          placeholder="09123456789"
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