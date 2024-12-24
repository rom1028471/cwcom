import { axiosInstance } from './axiosInstance';

export const getCart = () => {
  return axiosInstance.get('/api/cart')
    .then(response => response.data);
};

export const addToCart = (publicationId, subscriptionPeriod) => {
  return axiosInstance.post('/api/cart/add', { publicationId, subscriptionPeriod })
    .then(response => response.data);
};

export const removeFromCart = (itemId) => {
  return axiosInstance.delete(`/api/cart/items/${itemId}`)
    .then(response => response.data);
};

export const clearCart = () => {
  return axiosInstance.post('/api/cart/clear')
    .then(response => response.data);
}; 