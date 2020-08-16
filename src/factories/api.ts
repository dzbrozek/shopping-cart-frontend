import { Factory } from 'rosie';
import * as faker from 'faker';

import { MeResponse, ProductResponse, BasketProductResponse } from 'api/types';

export const MeResponseFactory = new Factory<MeResponse>().attrs({
  isAdmin: () => faker.random.boolean(),
});

export const ProductResponseFactory = new Factory<ProductResponse>().attrs({
  uuid: () => faker.random.uuid(),
  name: () => faker.random.word(),
  price: () => String(faker.random.number()),
  image: () => faker.random.image(),
});

export const BasketProductResponseFactory = new Factory<
  BasketProductResponse
>().attrs({
  uuid: () => faker.random.uuid(),
  product: () => ProductResponseFactory.build(),
  quantity: () => faker.random.number(),
});
