import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0, 51, 160, 0.15)',
          borderRadius: '8px',
          maxWidth: '320px',
        },
      }}
    />
  );
};

export const showToast = (message, type = 'success') => {
  const icons = {
    success: <CheckCircle className="text-[#2ECC71]" size={20} />,
    info: <Info className="text-[#3498DB]" size={20} />,
    warning: <AlertTriangle className="text-[#F39C12]" size={20} />,
    error: <XCircle className="text-[#E74C3C]" size={20} />,
  };

  const borderColors = {
    success: 'border-l-4 border-l-[#2ECC71]',
    info: 'border-l-4 border-l-[#3498DB]',
    warning: 'border-l-4 border-l-[#F39C12]',
    error: 'border-l-4 border-l-[#E74C3C]',
  };

  toast.custom((t) => (
    <div
      className={`
        ${t.visible ? 'animate-enter' : 'animate-leave'}
        max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5
        ${borderColors[type]}
      `}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {icons[type]}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0033A0]"
        >
          Close
        </button>
      </div>
    </div>
  ));
};
