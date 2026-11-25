import { SituacaoAgendamento } from '../enums/situacaoAgendamento';

export function formatCpf(cpf: string | undefined | null): string {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
}

export function formatCelular(celular: string | undefined | null): string {
  if (!celular) return '';
  const cleaned = celular.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return celular;
}

export function formatDateTime(isoString: string | undefined | null): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function getSituacaoLabel(situacao: SituacaoAgendamento | string): string {
  switch (situacao) {
    case SituacaoAgendamento.PENDENTE:
      return 'Pendente';
    case SituacaoAgendamento.CONFIRMADO:
      return 'Confirmado';
    case SituacaoAgendamento.REALIZADO:
      return 'Realizado';
    case SituacaoAgendamento.CANCELADA:
      return 'Cancelada';
    case SituacaoAgendamento.NAO_REALIZADO:
      return 'Não Realizado';
    default:
      return String(situacao);
  }
}

export function getSituacaoBadgeColor(situacao: SituacaoAgendamento | string): { bg: string; color: string; border: string } {
  switch (situacao) {
    case SituacaoAgendamento.CONFIRMADO:
      return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
    case SituacaoAgendamento.REALIZADO:
      return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    case SituacaoAgendamento.PENDENTE:
      return { bg: '#fffbeb', color: '#b45309', border: '#fde68a' };
    case SituacaoAgendamento.CANCELADA:
    case SituacaoAgendamento.NAO_REALIZADO:
      return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
    default:
      return { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' };
  }
}