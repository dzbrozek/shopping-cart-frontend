import useSWR, { responseInterface } from 'swr';
import { AxiosError } from 'axios';

import API from 'api';
import { BasketProductResponse } from 'api/types';

const useBasket = (): responseInterface<
  BasketProductResponse[],
  AxiosError
> => {
  const fetcher = async (): Promise<BasketProductResponse[]> => {
    const { data } = await API.basket();
    return data;
  };

  return useSWR('/basket/', fetcher);
};

export default useBasket;
