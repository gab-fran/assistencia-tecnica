import type { ClienteResumoDTO } from './cliente';

export interface EquipamentoResponseDTO {
  idEquipamento: number;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  cliente: ClienteResumoDTO;
  statusEquipamento?: boolean;
}

export interface EquipamentoResumoDTO {
  idEquipamento: number;
  tipo: string;
  marca: string;
  modelo: string;
}

export interface EquipamentoCreateDTO {
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  idCliente: number;
}

export interface EquipamentoUpdateDTO {
  tipo?: string;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  idCliente?: number;
}
