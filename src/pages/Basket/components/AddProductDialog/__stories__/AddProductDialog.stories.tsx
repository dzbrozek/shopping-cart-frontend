import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import AddProductDialog from '../AddProductDialog';
import { AddProductDialogProps } from '../types';

export default {
  title: 'Basket/AddProductDialog',
  component: AddProductDialog,
} as Meta;

const Template: Story<AddProductDialogProps> = (args) => (
  <AddProductDialog {...args} />
);

export const Open = Template.bind({});
Open.args = {
  open: true,
};
