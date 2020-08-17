import React from 'react';
import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { mutate } from 'swr';
import * as yup from 'yup';
import FormHelperText from '@material-ui/core/FormHelperText';

import API from 'api';
import { formErrors } from 'utils/api';

import { LoginDialogProps, LoginFormValues } from './types';

export const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please provide valid email')
    .required('Please provide email'),
  password: yup.string().required('Please provide password'),
});

const LoginDialog = ({
  open,
  onClose,
}: LoginDialogProps): React.ReactElement => {
  const { handleSubmit, register, errors, reset, setError } = useForm<
    LoginFormValues
  >({
    resolver: yupResolver(schema),
  });
  const [isLogining, setIsLogining] = React.useState(false);
  const [stateError, setStateError] = React.useState<string | undefined>(
    undefined,
  );
  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    try {
      setIsLogining(true);
      const { data: meData } = await API.logIn(data);
      await mutate('/me/', meData, false);
      setStateError('');
      reset();
      onClose();
    } catch (e) {
      const [nonFieldError, fieldErrors] = formErrors<keyof LoginFormValues>(e);
      fieldErrors?.forEach(({ name, error }) => {
        setError(name, error);
      });
      setStateError(nonFieldError);
    } finally {
      setIsLogining(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="login-dialog-title"
      maxWidth="sm"
      fullWidth>
      <DialogTitle id="login-dialog-title">Login</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {stateError ? (
            <Box marginY={2}>
              <FormHelperText error>{stateError}</FormHelperText>
            </Box>
          ) : null}
          <TextField
            autoFocus
            id="email"
            name="email"
            label="Email"
            fullWidth
            type="email"
            inputRef={register}
            error={!!errors.email?.message}
            helperText={errors.email?.message}
          />

          <Box marginY={2}>
            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              fullWidth
              inputRef={register}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
          <Button color="primary" type="submit" disabled={isLogining}>
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
