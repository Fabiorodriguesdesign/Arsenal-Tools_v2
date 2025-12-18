

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Tool, Lead, NewTool, BioLink, NewBioLink, Product, NewProduct } from '../types';

type ModalType = 'adminLogin' | 'leadCapture' | 'leadDetail' | 'addEditTool' | 'confirmation' | 'addEditBioLink' | 'addEditProduct';

interface ModalProps {
  // Props for LeadCaptureModal
  tool?: Tool;
  onAddLead?: (leadData: { name: string; email: string; whatsapp?: string; toolOfInterest: string }) => Promise<void>;
  
  // Props for LeadDetailModal
  lead?: Lead;
  onSaveNotes?: (leadId: number, notes: string) => void | Promise<void>;

  // Props for AddEditToolModal
  toolToEdit?: Tool | null;
  onSave?: (tool: NewTool | Tool) => void | Promise<void>;
  
  // Props for AddEditBioLinkModal
  linkToEdit?: BioLink | null;
  onSaveBioLink?: (link: NewBioLink | BioLink) => void | Promise<void>;
  
  // Props for AddEditProductModal
  productToEdit?: Product | null;
  onSaveProduct?: (product: NewProduct | Product) => void | Promise<void>;

  // Props for ConfirmationModal
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
}


interface ModalState {
  type: ModalType | null;
  props: ModalProps;
}

interface ModalContextType {
  openModal: (type: ModalType, props?: ModalProps) => void;
  closeModal: () => void;
  modalState: ModalState;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({ type: null, props: {} });

  const openModal = useCallback((type: ModalType, props: ModalProps = {}) => {
    setModalState({ type, props });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, props: {} });
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalState }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};