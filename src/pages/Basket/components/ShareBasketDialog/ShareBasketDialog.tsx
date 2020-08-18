import { yupResolver } from '@hookform/resolvers';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import API from 'api';
import { formErrors } from 'utils/api';

import { ShareBasketDialogProps, ShareFormValues } from './types';

export const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please provide valid email')
    .required('Please provide email'),
});

const ShareBasketDialog = ({
  open,
  onClose,
}: ShareBasketDialogProps): React.ReactElement => {
  const { handleSubmit, register, errors, setError } = useForm<ShareFormValues>(
    {
      resolver: yupResolver(schema),
    },
  );
  const [isSharing, setIsSharing] = React.useState(false);
  const [stateError, setStateError] = React.useState<string | undefined>(
    undefined,
  );
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit = async (data: ShareFormValues): Promise<void> => {
    try {
      setIsSharing(true);
      await API.shareBasket(data);
      enqueueSnackbar('Basket has been shared', {
        variant: 'success',
      });
      onClose();
    } catch (e) {
      const [nonFieldError, fieldErrors] = formErrors<keyof ShareFormValues>(e);
      fieldErrors?.forEach(({ name, error }) => {
        setError(name, error);
      });
      setStateError(nonFieldError);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="share-dialog-title"
      aria-describedby="share-dialog-description"
      maxWidth="sm"
      fullWidth>
      <DialogTitle id="share-dialog-title">Share basket</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
          <Button color="primary" type="submit" disabled={isSharing}>
            Share
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShareBasketDialog;
