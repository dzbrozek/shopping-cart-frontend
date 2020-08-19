import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ShareBasketDialog from '../ShareBasketDialog';
import { ShareBasketDialogProps } from '../types';

export default {
  title: 'Basket/ShareBasketDialog',
  component: ShareBasketDialog,
} as Meta;

const Template: Story<ShareBasketDialogProps> = (args) => (
  <ShareBasketDialog {...args} />
);

export const Open = Template.bind({});
Open.args = {
  open: true,
};
