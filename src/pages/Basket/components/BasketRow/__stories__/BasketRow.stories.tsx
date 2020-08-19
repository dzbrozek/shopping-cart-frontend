import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { ProductResponseFactory } from 'factories/api';

import BasketRow from '../BasketRow';
import { BasketRowProps } from '../types';

export default {
  title: 'Basket/BasketRow',
  component: BasketRow,
  decorators: [
    (StoryComponent) => (
      <Table>
        <TableBody>
          <StoryComponent />
        </TableBody>
      </Table>
    ),
  ],
} as Meta;

const Template: Story<BasketRowProps> = (args) => <BasketRow {...args} />;

const product = ProductResponseFactory.build();

export const Default = Template.bind({});
Default.args = {
  image: product.image,
  name: product.name,
  quantity: 3,
  price: Number(product.price),
};
