import useSWR, { responseInterface } from 'swr';
import { AxiosError } from 'axios';

import API from 'api';
import { MeResponse } from 'api/types';

const useMe = (): responseInterface<MeResponse | null, AxiosError> => {
  const fetcher = async (): Promise<MeResponse | null> => {
    try {
      const { data } = await API.me();
      return data;
    } catch (e) {
      if (e.response?.status !== 403) {
        console.log('API me error', e);
      }
      return null;
    }
  };

  return useSWR('/me/', fetcher);
};

export default useMe;
