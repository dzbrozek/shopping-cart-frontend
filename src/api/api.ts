import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { MeResponse, ProductResponse, BasketProductResponse } from './types';

class API {
  static me(): AxiosPromise<MeResponse> {
    return API.request({
      url: '/me/',
      method: 'GET',
    });
  }

  static products(): AxiosPromise<ProductResponse[]> {
    return API.request({
      url: '/products/',
      method: 'GET',
    });
  }

  static deleteProduct(productId: string): AxiosPromise<string> {
    return API.request({
      url: `/products/${productId}/`,
      method: 'DELETE',
    });
  }

  static basket(): AxiosPromise<BasketProductResponse[]> {
    return API.request({
      url: '/basket/',
      method: 'GET',
    });
  }

  static clearBasket(): AxiosPromise<string> {
    return API.request({
      url: '/basket/',
      method: 'DELETE',
    });
  }

  static addProductToBasket(
    productId: string,
    data: { quantity: number },
  ): AxiosPromise<BasketProductResponse> {
    return API.request({
      url: `/basket/products/${productId}/`,
      method: 'PUT',
      data,
    });
  }

  static removeProductFromBasket(productId: string): AxiosPromise<string> {
    return API.request({
      url: `/basket/products/${productId}/`,
      method: 'DELETE',
    });
  }

  static login(data: {
    email: string;
    password: string;
  }): AxiosPromise<MeResponse> {
    return API.request({
      url: `/login/`,
      method: 'POST',
      data,
    });
  }

  static logOut(): AxiosPromise<string> {
    return API.request({
      url: `/logout/`,
      method: 'POST',
    });
  }

  static request<T = unknown>(config: AxiosRequestConfig): AxiosPromise<T> {
    return axios({
      ...config,
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'csrftoken',
    });
  }
}

export default API;
