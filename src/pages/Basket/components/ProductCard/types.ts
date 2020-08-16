import { ProductResponse } from 'api/types';

export interface ProductCardProps {
  product: ProductResponse;
  onDelete?: () => void;
}
