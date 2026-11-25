export const SituacaoAgendamento = {
  PENDENTE: 'PENDENTE',
  CONFIRMADO: 'CONFIRMADO',
  REALIZADO: 'REALIZADO',
  CANCELADA: 'CANCELADA',
  NAO_REALIZADO: 'NAO_REALIZADO',
} as const;

export type SituacaoAgendamento = (typeof SituacaoAgendamento)[keyof typeof SituacaoAgendamento];

export const situacaoAgendamentoOptions = [
  { label: 'Pendente', value: SituacaoAgendamento.PENDENTE },
  { label: 'Confirmado', value: SituacaoAgendamento.CONFIRMADO },
  { label: 'Realizado', value: SituacaoAgendamento.REALIZADO },
  { label: 'Não Realizado', value: SituacaoAgendamento.NAO_REALIZADO },
  { label: 'Cancelada', value: SituacaoAgendamento.CANCELADA },
] as const;
