import { AxiosError } from 'axios';
import { ErrorOption } from 'react-hook-form/dist/types/form';

export function isStatusError(error: AxiosError, status: number): boolean {
  try {
    return error.response?.status === status;
  } catch (e) {
    return false;
  }
}

type ErrorType<T> = { name: T; error: ErrorOption };

export function formErrors<T extends string>(
  error: AxiosError<
    | string[]
    | {
        [k: string]: string[];
      }
    | undefined
  >,
  defaultNonFieldError:
    | string
    | undefined = 'Something went wrong. Please try later',
): [string | undefined, ErrorType<T>[] | undefined] {
  if (!isStatusError(error, 400) || !error.response?.data) {
    return [defaultNonFieldError, []];
  }

  const {
    response: { data },
  } = error;
  if (Array.isArray(data)) {
    return [data.join(' '), undefined];
  }

  if (!data) {
    return [defaultNonFieldError, undefined];
  }

  const { nonFieldErrors } = data;
  delete data.nonFieldErrors;

  const fieldErrors: ErrorType<T>[] = [];

  for (const [key, value] of Object.entries(data)) {
    fieldErrors.push({
      name: key as T,
      error: {
        type: 'manual',
        message: value.join(' '),
      },
    });
  }
  return [
    nonFieldErrors ? nonFieldErrors.join(' ') : undefined,
    fieldErrors.length ? fieldErrors : undefined,
  ];
}
