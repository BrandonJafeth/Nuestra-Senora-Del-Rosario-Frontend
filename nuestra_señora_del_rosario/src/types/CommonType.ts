export interface ButtonProps {
    text: string;
    onClick: () => void;
  }

  export interface TextInputProps {
    type: string;
    placeholder: string;
    iconName: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

  export interface ToastProps {
    message: string | null;
    type: 'success' | 'error' | 'warning' | 'info' | null;
  }