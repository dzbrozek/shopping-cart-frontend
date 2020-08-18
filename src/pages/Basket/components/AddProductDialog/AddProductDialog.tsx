import { yupResolver } from '@hookform/resolvers';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from 'yup';

import { ProductResponse } from 'api/types';
import API from 'api';
import { formErrors } from 'utils/api';
import { fileToBase64 } from 'utils/files';

import { FileInput } from './styles';
import { AddProductDialogProps, AddProductFormValues } from './types';

export const schema = yup.object().shape({
  name: yup.string().max(200).required('Please provide name'),
  price: yup.number().typeError('Please provide valid number'),
  image: yup.mixed().test('isFile', 'Please select image', (value) => {
    return !!value.length;
  }),
});

const AddProductDialog = ({
  open,
  onClose,
}: AddProductDialogProps): React.ReactElement => {
  const { handleSubmit, register, errors, setError } = useForm<
    AddProductFormValues
  >({
    resolver: yupResolver(schema),
  });
  const [isAdding, setIsAdding] = React.useState(false);
  const [stateError, setStateError] = React.useState<string | undefined>(
    undefined,
  );
  const onSubmit = async (data: AddProductFormValues): Promise<void> => {
    try {
      setIsAdding(true);
      const { data: productData } = await API.createProduct({
        ...data,
        image: (await fileToBase64(data.image[0])) as string,
      });
      await mutate(
        '/products/',
        (cacheData: ProductResponse[] | undefined) => {
          return [...(cacheData || []), productData];
        },
        false,
      );
      onClose();
    } catch (e) {
      const [nonFieldError, fieldErrors] = formErrors<
        keyof AddProductFormValues
      >(e);
      fieldErrors?.forEach(({ name, error }) => {
        setError(name, error);
      });
      setStateError(nonFieldError);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="add-product-dialog-title"
      maxWidth="sm"
      fullWidth>
      <DialogTitle id="add-product-dialog-title">Add new product</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {stateError ? (
            <Box marginY={2}>
              <FormHelperText error>{stateError}</FormHelperText>
            </Box>
          ) : null}
          <TextField
            autoFocus
            id="name"
            name="name"
            label="Name"
            fullWidth
            inputRef={register}
            error={!!errors.name?.message}
            helperText={errors.name?.message}
          />

          <Box marginTop={2}>
            <TextField
              id="price"
              name="price"
              label="Price"
              fullWidth
              inputRef={register}
              error={!!errors.price?.message}
              helperText={errors.price?.message}
            />
          </Box>

          <Box marginTop={2}>
            <FileInput
              id="image"
              name="image"
              label="Image"
              fullWidth
              inputProps={{
                accept: 'image/*',
              }}
              type="file"
              inputRef={register}
              error={!!errors.image?.message}
              helperText={errors.image?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
          <Button color="primary" type="submit" disabled={isAdding}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductDialog;
