import { action } from '@storybook/addon-actions';
import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { ProductResponseFactory } from 'factories/api';

import ProductCard from '../ProductCard';
import { ProductCardProps } from '../types';

export default {
  title: 'Basket/ProductCard',
  component: ProductCard,
} as Meta;

const Template: Story<ProductCardProps> = (args) => <ProductCard {...args} />;

const product = ProductResponseFactory.build();

export const Default = Template.bind({});
Default.args = {
  product,
  onDelete: undefined,
};

export const WithDelete = Template.bind({});
WithDelete.args = {
  product,
  onDelete: action('onDelete'),
};
