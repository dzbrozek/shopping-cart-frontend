import useSWR, { responseInterface } from 'swr';
import { AxiosError } from 'axios';

import API from 'api';
import { MeResponse } from 'api/types';

const useMe = (): responseInterface<MeResponse, AxiosError> => {
  const fetcher = async (): Promise<MeResponse> => {
    const { data } = await API.me();
    return data;
  };

  return useSWR('/me/', fetcher, {
    errorRetryCount: 0,
  });
};

export default useMe;
