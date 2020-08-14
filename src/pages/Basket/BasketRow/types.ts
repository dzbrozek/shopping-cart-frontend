export interface BasketRowProps {
  name: string;
  quantity: number;
  price: number;
  image: string;
  onDelete: () => void;
}
