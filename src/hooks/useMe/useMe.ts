import useSWR, { responseInterface } from 'swr';
import { AxiosError } from 'axios';

import API from 'api';
import { MeResponse } from 'api/types';
import { isStatusError } from 'utils/api';

const useMe = (): responseInterface<MeResponse | null, AxiosError> => {
  const fetcher = async (): Promise<MeResponse | null> => {
    try {
      const { data } = await API.me();
      return data;
    } catch (e) {
      if (!isStatusError(e, 403)) {
        console.log('API me error', e);
      }
      return null;
    }
  };

  return useSWR('/me/', fetcher);
};

export default useMe;
