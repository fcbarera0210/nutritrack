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
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed z-50 flex items-center justify-center" 
      style={{ 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        margin: 0, 
        padding: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Backdrop - debe cubrir toda la pantalla sin márgenes */}
      <div 
        className="fixed bg-black/50"
        style={{ 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          margin: 0, 
          padding: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-[#D9D9D9] rounded-[30px] shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col" 
        style={{ 
          fontFamily: 'Quicksand, sans-serif',
          zIndex: 2
        }}
      >
        {/* Header - sin margen superior */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#131917] rounded-t-[30px] flex-shrink-0">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Quicksand, sans-serif' }}>{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#131917] hover:bg-gray-200 transition-colors flex-shrink-0 aspect-square"
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        )}
        
        {/* Body - con scroll interno */}
        <div className="p-6 pb-8 overflow-y-auto scrollbar-hide flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

