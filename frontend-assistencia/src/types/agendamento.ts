import type { SituacaoAgendamento } from '../enums/situacaoAgendamento';
import type { EquipamentoResumoDTO } from './equipamento';

export interface AgendamentoResponseDTO {
  idAgendamento: number;
  dataAgendamento: string;
  descricao?: string;
  situacaoAgendamento: SituacaoAgendamento;
  equipamento: EquipamentoResumoDTO;
  statusAgendamento?: boolean;
}

export interface AgendamentoCreateDTO {
  dataAgendamento: string;
  descricao?: string;
  situacaoAgendamento: SituacaoAgendamento;
  idEquipamento: number;
}

export interface AgendamentoUpdateDTO {
  dataAgendamento?: string;
  descricao?: string;
  situacaoAgendamento?: SituacaoAgendamento;
  idEquipamento?: number;
}
