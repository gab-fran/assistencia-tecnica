import { endpoints } from '../utils/endpoints';
import { apiRequest } from './apiClient';

export const homeService = {
  verificarApi: () =>
    apiRequest<string>(endpoints.home, {
      method: 'GET',
      authenticated: false,
    }),
};
