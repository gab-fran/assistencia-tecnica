import type { Page, PageRequest } from '../types/api';
import type { ClienteCreateDTO, ClienteResponseDTO, ClienteUpdateDTO } from '../types/cliente';
import { endpoints } from '../utils/endpoints';
import { apiRequest } from './apiClient';

export const clienteService = {
  listar: (params?: PageRequest) =>
    apiRequest<Page<ClienteResponseDTO>>(endpoints.clientes.base, {
      method: 'GET',
      query: params,
    }),

  buscarPorId: (id: number) =>
    apiRequest<ClienteResponseDTO>(endpoints.clientes.byId(id), {
      method: 'GET',
    }),

  buscarPorEmail: (email: string) =>
    apiRequest<ClienteResponseDTO>(endpoints.clientes.byEmail(email), {
      method: 'GET',
    }),

  buscarPorCpf: (cpf: string) =>
    apiRequest<ClienteResponseDTO>(endpoints.clientes.byCpf(cpf), {
      method: 'GET',
    }),

  cadastrar: (dados: ClienteCreateDTO) =>
    apiRequest<ClienteResponseDTO>(endpoints.clientes.base, {
      method: 'POST',
      body: dados,
    }),

  atualizar: (id: number, dados: ClienteUpdateDTO) =>
    apiRequest<ClienteResponseDTO>(endpoints.clientes.byId(id), {
      method: 'PUT',
      body: dados,
    }),

  remover: (id: number) =>
    apiRequest<string>(endpoints.clientes.byId(id), {
      method: 'DELETE',
    }),
};
