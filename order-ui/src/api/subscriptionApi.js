import { axiosInstance } from './axiosInstance';

export const getSubscriptions = () => {
  return axiosInstance.get('/api/subscriptions/profile')
    .then(response => response.data);
};

export const getActiveSubscriptions = () => {
  return axiosInstance.get('/api/subscriptions/active')
    .then(response => response.data);
};

export const getInactiveSubscriptions = () => {
  return axiosInstance.get('/api/subscriptions/inactive')
    .then(response => response.data);
};

export const createSubscriptionsFromCart = () => {
  return axiosInstance.post('/api/subscriptions/create-from-cart')
    .then(response => response.data);
};

export const extendSubscription = (id) => {
  return axiosInstance.post(`/api/subscriptions/${id}/extend`)
    .then(response => response.data);
};

export const cancelSubscription = (id) => {
  return axiosInstance.delete(`/api/subscriptions/${id}`)
    .then(response => response.data);
};

export const checkActiveSubscription = (publicationId) => {
  return axiosInstance.get(`/api/subscriptions/check/${publicationId}`)
    .then(response => response.data);
}; 