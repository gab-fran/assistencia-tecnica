import type { Page, PageRequest } from '../types/api';
import type { AgendamentoCreateDTO, AgendamentoResponseDTO, AgendamentoUpdateDTO } from '../types/agendamento';
import { endpoints } from '../utils/endpoints';
import { apiRequest } from './apiClient';

export const agendamentoService = {
  listar: (params?: PageRequest) =>
    apiRequest<Page<AgendamentoResponseDTO>>(endpoints.agendamento.base, {
      method: 'GET',
      query: params,
    }),

  buscarPorId: (id: number) =>
    apiRequest<AgendamentoResponseDTO>(endpoints.agendamento.byId(id), {
      method: 'GET',
    }),

  cadastrar: (dados: AgendamentoCreateDTO) =>
    apiRequest<AgendamentoResponseDTO>(endpoints.agendamento.base, {
      method: 'POST',
      body: dados,
    }),

  atualizar: (id: number, dados: AgendamentoUpdateDTO) =>
    apiRequest<AgendamentoResponseDTO>(endpoints.agendamento.byId(id), {
      method: 'PUT',
      body: dados,
    }),

  remover: (id: number) =>
    apiRequest<string>(endpoints.agendamento.byId(id), {
      method: 'DELETE',
    }),
};
