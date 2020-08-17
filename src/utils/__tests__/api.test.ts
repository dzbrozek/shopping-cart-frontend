import { AxiosError } from 'axios';

import { formErrors, isStatusError } from 'utils/api';

describe('api', () => {
  it('should test status error', () => {
    const error = ({
      response: {
        status: 403,
      },
    } as unknown) as AxiosError;

    expect(isStatusError(error, 403)).toBeTruthy();

    expect(isStatusError(error, 500)).toBeFalsy();
  });

  describe('formErrors', () => {
    it('should test unsupported error code', () => {
      const error = ({
        response: {
          status: 500,
        },
      } as unknown) as AxiosError;
      expect(formErrors(error)).toEqual([
        'Something went wrong. Please try later',
        [],
      ]);
    });

    it('should test custom message for non field error', () => {
      const error = ({
        response: {
          status: 500,
        },
      } as unknown) as AxiosError;
      expect(formErrors(error, 'Custom message')).toEqual([
        'Custom message',
        [],
      ]);
    });

    it('should test bad request with array of errors', () => {
      const error = ({
        response: {
          status: 400,
          data: ['Invalid credentials'],
        },
      } as unknown) as AxiosError;
      expect(formErrors(error)).toEqual(['Invalid credentials', []]);
    });

    it('should test bad request with non field errors', () => {
      const error = ({
        response: {
          status: 400,
          data: {
            nonFieldErrors: ['Invalid credentials'],
          },
        },
      } as unknown) as AxiosError;
      expect(formErrors(error)).toEqual(['Invalid credentials', []]);
    });

    it('should test bad request with field errors', () => {
      const error = ({
        response: {
          status: 400,
          data: {
            email: ['Provide valid email'],
            password: ['Password is too common'],
          },
        },
      } as unknown) as AxiosError;
      expect(formErrors(error)).toEqual([
        '',
        [
          {
            name: 'email',
            error: {
              message: 'Provide valid email',
              type: 'manual',
            },
          },
          {
            name: 'password',
            error: {
              message: 'Password is too common',
              type: 'manual',
            },
          },
        ],
      ]);
    });
  });
});
