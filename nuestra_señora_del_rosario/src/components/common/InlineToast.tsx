
import { ToastProps } from '../../types/CommonType';

const InlineToast: React.FC<ToastProps> = ({ message, type }) => {
  if (!message) return null;

  // Estilos según el tipo de mensaje
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div
      className={`${getToastStyles()} px-4 py-3 rounded-lg shadow-md text-center font-medium animate-pulse`}
    >
      {message}
    </div>
  );
};

export default InlineToast;