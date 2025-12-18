import React from 'react';
import AdminLoginForm from './AdminLoginForm';
import BaseModal from './ui/BaseModal';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <BaseModal onClose={onClose} titleId="auth-modal-title" containerClassName="max-w-md">
      <div className="p-4 sm:p-6 md:p-8">
        <AdminLoginForm />
      </div>
    </BaseModal>
  );
};

export default AuthModal;