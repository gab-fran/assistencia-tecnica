import { createElement } from 'react';
import { z } from 'zod';
import type { ListColumn } from '../components/DynamicList/DynamicList';
import type { AgendamentoResponseDTO } from '../types/agendamento';
import { SituacaoAgendamento } from '../enums/situacaoAgendamento';
import { formatDateTime, getSituacaoBadgeColor, getSituacaoLabel } from '../utils/formatters';

export const agendamentoListColumns: ListColumn<AgendamentoResponseDTO>[] = [
  {
    key: 'dataAgendamento',
    header: 'Data do Agendamento',
    render: (item) => formatDateTime(item.dataAgendamento),
  },
  {
    key: 'equipamento',
    header: 'Equipamento',
    render: (item) =>
      item.equipamento
        ? `${item.equipamento.tipo} ${item.equipamento.marca} (${item.equipamento.modelo})`
        : 'Equipamento não informado',
  },
  {
    key: 'situacaoAgendamento',
    header: 'Situação',
    render: (item) => {
      const colors = getSituacaoBadgeColor(item.situacaoAgendamento);
      return createElement(
        'span',
        {
          style: {
            backgroundColor: colors.bg,
            color: colors.color,
            border: `1px solid ${colors.border}`,
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'inline-block',
          },
        },
        getSituacaoLabel(item.situacaoAgendamento)
      );
    },
  },
  {
    key: 'descricao',
    header: 'Descrição / Defeito',
    render: (item) => item.descricao || '—',
  },
];

export const agendamentoCreateSchema = z.object({
  dataAgendamento: z.string().min(1, 'A data do agendamento é obrigatória.'),
  descricao: z.string().max(255, 'Máximo de 255 caracteres.').optional().or(z.literal('')),
  situacaoAgendamento: z.enum(
    [
      SituacaoAgendamento.PENDENTE,
      SituacaoAgendamento.CONFIRMADO,
      SituacaoAgendamento.REALIZADO,
      SituacaoAgendamento.NAO_REALIZADO,
      SituacaoAgendamento.CANCELADA,
    ] as const,
    { message: 'Selecione uma situação válida.' }
  ),
  idEquipamento: z.coerce.number({ message: 'Selecione um equipamento.' }).min(1, 'O equipamento é obrigatório.'),
});

export const agendamentoUpdateSchema = z.object({
  dataAgendamento: z.string().min(1, 'A data do agendamento é obrigatória.'),
  descricao: z.string().max(255, 'Máximo de 255 caracteres.').optional().or(z.literal('')),
  situacaoAgendamento: z.enum(
    [
      SituacaoAgendamento.PENDENTE,
      SituacaoAgendamento.CONFIRMADO,
      SituacaoAgendamento.REALIZADO,
      SituacaoAgendamento.NAO_REALIZADO,
      SituacaoAgendamento.CANCELADA,
    ] as const,
    { message: 'Selecione uma situação válida.' }
  ),
  idEquipamento: z.coerce.number().optional(),
});

export type AgendamentoCreateFormData = z.infer<typeof agendamentoCreateSchema>;
export type AgendamentoUpdateFormData = z.infer<typeof agendamentoUpdateSchema>;
