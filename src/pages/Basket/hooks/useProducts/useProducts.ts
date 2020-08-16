import useSWR, { responseInterface } from 'swr';
import { AxiosError } from 'axios';

import API from 'api';
import { ProductResponse } from 'api/types';

const useProducts = (): responseInterface<ProductResponse[], AxiosError> => {
  const fetcher = async (): Promise<ProductResponse[]> => {
    const { data } = await API.products();
    return data;
  };

  return useSWR('/products/', fetcher);
};

export default useProducts;
