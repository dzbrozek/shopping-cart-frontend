import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import LoginDialog from '../LoginDialog';
import { LoginDialogProps } from '../types';

export default {
  title: 'Basket/LoginDialog',
  component: LoginDialog,
} as Meta;

const Template: Story<LoginDialogProps> = (args) => <LoginDialog {...args} />;

export const Open = Template.bind({});
Open.args = {
  open: true,
};
