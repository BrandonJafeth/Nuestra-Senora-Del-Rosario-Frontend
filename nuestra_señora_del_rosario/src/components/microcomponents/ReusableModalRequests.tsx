import React, { useEffect } from 'react';
import { ButtonProps } from '../../types/ButtonProps';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const ReusableModalRequests: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  actions,
}) => {
  // Bloquear scroll global cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div
        className={`
          bg-white dark:bg-gray-800 
          p-8 rounded-2xl shadow-xl 
          w-full max-w-xl relative
          hide-scrollbar  /* Usar la clase que oculta el scrollbar */
        `}
        style={{ 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}
      >
        {/* Botón de cierre */}
        <button
          className="
            absolute top-4 right-4 
            text-gray-600 hover:text-gray-800 
            dark:text-gray-300 dark:hover:text-white 
            text-3xl font-bold
          "
          onClick={onClose}
        >
          &times;
        </button>

        {/* Título */}
        <h3 className="
          text-3xl font-bold mb-6 text-center 
          text-gray-800 dark:text-gray-100
        ">
          {title}
        </h3>

        {/* Contenido (grid de 2 columnas en >=sm) */}
        <div 
          className="
            grid grid-cols-1 sm:grid-cols-2 
            gap-x-8 gap-y-4 mb-6 
            text-lg text-gray-700 dark:text-gray-300 
            break-words
          "
        >
          {children}
        </div>

        {/* Acciones */}
        <div className="flex justify-center space-x-4 mt-8">
          {React.Children.map(actions, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<ButtonProps>, {
                ...child.props,
                className: `${child.props.className || ''} ${
                  child.props.disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`.trim()
              });
            }
            return child;
          })}
        </div>
      </div>
    </div>
  );
};

export default ReusableModalRequests;
