"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchUserInfo, updateUserContact } from '../../../store/userContactSlice';
import { Card } from '../../../components/ui/Card';
import { Notification } from '../../../components/Notification';
import { ContactCard } from '../components/ContactCard';
import { EditEmailModal } from '../components/EditEmailModal';
import { EditPhoneModal } from '../components/EditPhoneModal';
import { CONTACT_LABELS, MESSAGES } from '../components/constants';

export function ContactInfo() {
  const dispatch = useDispatch<AppDispatch>();
  const { email, phone_number, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user data on mount
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  // Show error notification
  useEffect(() => {
    if (error) {
      setNotification({
        message: error,
        type: 'error',
      });
    }
  }, [error]);

  const handleEmailUpdate = async (newEmail: string) => {
    setIsLoading(true);
    try {
      await dispatch(updateUserContact({ email: newEmail })).unwrap();
      setNotification({
        message: MESSAGES.email_success,
        type: 'success',
      });
      dispatch(fetchUserInfo());
    } catch (error) {
      setNotification({
        message: MESSAGES.email_error,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneUpdate = async (newPhone: string) => {
    setIsLoading(true);
    try {
      await dispatch(updateUserContact({ phone_number: newPhone })).unwrap();
      setNotification({
        message: MESSAGES.phone_success,
        type: 'success',
      });
      dispatch(fetchUserInfo());
    } catch (error) {
      setNotification({
        message: MESSAGES.phone_error,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
          duration={3000}
        />
      )}

      <EditEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        currentEmail={email}
        onSubmit={handleEmailUpdate}
        isLoading={isLoading}
      />

      <EditPhoneModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        currentPhone={phone_number}
        onSubmit={handlePhoneUpdate}
        isLoading={isLoading}
      />

      <Card 
        variant="filled" 
        hover 
        className="mx-auto w-full max-w-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-500"
      >
        <div className="space-y-8">
        
          
          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-left-5 duration-500 delay-100">
              <ContactCard
                label={CONTACT_LABELS.email}
                value={email}
                onEdit={() => setIsEmailModalOpen(true)}
                isLoading={isLoading}
                notSetText={CONTACT_LABELS.not_set}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-right-5 duration-500 delay-200">
              <ContactCard
                label={CONTACT_LABELS.phone}
                value={phone_number}
                onEdit={() => setIsPhoneModalOpen(true)}
                isLoading={isLoading}
                notSetText={CONTACT_LABELS.not_set}
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
