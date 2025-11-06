'use client';

import { ReactNode, useEffect } from 'react';
import { X } from '@phosphor-icons/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#D9D9D9] rounded-[30px] shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto z-10 scrollbar-hide" style={{ fontFamily: 'Quicksand, sans-serif' }}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#131917] rounded-t-[30px] sticky top-0 z-20">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Quicksand, sans-serif' }}>{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#131917] hover:bg-gray-200 transition-colors flex-shrink-0 aspect-square"
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="p-6 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}

