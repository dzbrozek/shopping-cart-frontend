export interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface LoginDialogFormValues {
  email: string;
  password: string;
}
