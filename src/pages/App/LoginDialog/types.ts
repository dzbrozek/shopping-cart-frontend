export interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
