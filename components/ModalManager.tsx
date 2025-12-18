

import React, { Suspense, lazy } from 'react';
import { useModal } from '../contexts/ModalContext';
import LoadingSpinner from './ui/LoadingSpinner';

// Lazy Load Modals to reduce initial bundle size
const AuthModal = lazy(() => import('./AuthModal'));
const LeadCaptureModal = lazy(() => import('./LeadCaptureModal'));
const LeadDetailModal = lazy(() => import('./LeadDetailModal'));
const AddEditToolModal = lazy(() => import('./AddEditToolModal'));
const AddEditBioLinkModal = lazy(() => import('./AddEditBioLinkModal'));
const ConfirmationModal = lazy(() => import('./ConfirmationModal'));
const AddEditProductModal = lazy(() => import('./AddEditProductModal'));

const ModalManager: React.FC = () => {
  const { modalState, closeModal } = useModal();
  const { type, props } = modalState;

  if (!type) {
    return null;
  }

  const renderModalContent = () => {
    switch (type) {
      case 'adminLogin':
        return <AuthModal onClose={closeModal} />;
      
      case 'leadCapture':
        if (!props.tool || !props.onAddLead) return null;
        return <LeadCaptureModal tool={props.tool} onClose={closeModal} onAddLead={props.onAddLead} />;
        
      case 'leadDetail':
        if (!props.lead || !props.onSaveNotes) return null;
        return <LeadDetailModal lead={props.lead} onClose={closeModal} onSaveNotes={props.onSaveNotes} />;

      case 'addEditTool':
        if (props.onSave === undefined) return null;
        return <AddEditToolModal toolToEdit={props.toolToEdit || null} onClose={closeModal} onSave={props.onSave} />;

      case 'addEditBioLink':
        if (props.onSaveBioLink === undefined) return null;
        return <AddEditBioLinkModal linkToEdit={props.linkToEdit || null} onClose={closeModal} onSave={props.onSaveBioLink} />;

       case 'addEditProduct':
        if (props.onSaveProduct === undefined) return null;
        return <AddEditProductModal productToEdit={props.productToEdit || null} onClose={closeModal} onSave={props.onSaveProduct} />;

      case 'confirmation':
        if (!props.onConfirm) return null;
        return (
          <ConfirmationModal
            onClose={closeModal}
            onConfirm={props.onConfirm}
            title={props.title || 'Confirmar Ação'}
            message={props.message || 'Você tem certeza?'}
            confirmText={props.confirmText || 'Confirmar'}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Suspense 
        fallback={
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <LoadingSpinner />
            </div>
        }
    >
        {renderModalContent()}
    </Suspense>
  );
};

export default ModalManager;