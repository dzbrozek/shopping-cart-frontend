export interface MeResponse {
  isAdmin: boolean;
}

export interface ProductResponse {
  uuid: string;
  name: string;
  price: string;
  image: string;
}

export interface BasketProductResponse {
  uuid: string;
  product: ProductResponse;
  quantity: number;
}
