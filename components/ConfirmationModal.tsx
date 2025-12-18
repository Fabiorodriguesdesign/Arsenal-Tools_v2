
import React from 'react';
import BaseModal from './ui/BaseModal';
import { Icon } from './icons';

interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onClose, onConfirm, title, message, confirmText }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <BaseModal onClose={onClose} titleId="confirmation-modal-title" containerClassName="max-w-md">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
            <Icon name="warning" className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="mt-3 text-center sm:mt-4">
            <h2 id="confirmation-modal-title" className="font-bold text-xl text-neutral-900 dark:text-white">
              {title}
            </h2>
            <div className="mt-2">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-neutral-50 dark:bg-neutral-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-2xl">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600 dark:focus-visible:ring-offset-neutral-900"
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-900 dark:text-neutral-200 shadow-sm ring-1 ring-inset ring-neutral-300 dark:ring-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600 sm:mt-0 sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-900"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;