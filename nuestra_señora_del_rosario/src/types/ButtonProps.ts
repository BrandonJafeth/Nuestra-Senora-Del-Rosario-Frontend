export interface ButtonProps {
    className?: string;
    disabled?: boolean;
    [key: string]: unknown; // Allow other props with a safer type than any
  }
  