import type { Page, PageRequest } from '../types/api';
import type { EquipamentoCreateDTO, EquipamentoResponseDTO, EquipamentoUpdateDTO } from '../types/equipamento';
import { endpoints } from '../utils/endpoints';
import { apiRequest } from './apiClient';

export const equipamentoService = {
  listar: (params?: PageRequest) =>
    apiRequest<Page<EquipamentoResponseDTO>>(endpoints.equipamentos.base, {
      method: 'GET',
      query: params,
    }),

  buscarPorId: (id: number) =>
    apiRequest<EquipamentoResponseDTO>(endpoints.equipamentos.byId(id), {
      method: 'GET',
    }),

  listarPorCliente: (idCliente: number) =>
    apiRequest<EquipamentoResponseDTO[]>(endpoints.equipamentos.byCliente(idCliente), {
      method: 'GET',
    }),

  buscarPorNumeroSerie: (numeroSerie: string) =>
    apiRequest<EquipamentoResponseDTO>(endpoints.equipamentos.byNumeroSerie(numeroSerie), {
      method: 'GET',
    }),

  cadastrar: (dados: EquipamentoCreateDTO) =>
    apiRequest<EquipamentoResponseDTO>(endpoints.equipamentos.base, {
      method: 'POST',
      body: dados,
    }),

  atualizar: (id: number, dados: EquipamentoUpdateDTO) =>
    apiRequest<EquipamentoResponseDTO>(endpoints.equipamentos.byId(id), {
      method: 'PUT',
      body: dados,
    }),

  remover: (id: number) =>
    apiRequest<string>(endpoints.equipamentos.byId(id), {
      method: 'DELETE',
    }),
};
