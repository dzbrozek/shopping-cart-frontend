export interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface AddProductFormValues {
  name: string;
  price: number;
  image: FileList;
}
