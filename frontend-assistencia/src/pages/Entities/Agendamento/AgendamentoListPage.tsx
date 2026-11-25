import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal/DeleteConfirmModal';
import { DynamicList, type ListColumn } from '../../../components/DynamicList/DynamicList';
import { ApiError } from '../../../services/apiClient';
import { agendamentoService } from '../../../services/agendamentoService';
import { equipamentoService } from '../../../services/equipamentoService';
import type { Page } from '../../../types/api';
import type { AgendamentoResponseDTO } from '../../../types/agendamento';
import type { EquipamentoResponseDTO } from '../../../types/equipamento';
import { formatDateTime, getSituacaoBadgeColor, getSituacaoLabel } from '../../../utils/formatters';
import styles from '../List.module.css';

const PAGE_SIZE = 10;

export function AgendamentoListPage() {
  const [page, setPage] = useState<Page<AgendamentoResponseDTO> | null>(null);
  const [equipamentosMap, setEquipamentosMap] = useState<Record<number, EquipamentoResponseDTO>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick date change modal state (Requirement 7.2)
  const [quickDateAgendamento, setQuickDateAgendamento] = useState<AgendamentoResponseDTO | null>(null);
  const [newDateValue, setNewDateValue] = useState('');
  const [isSavingDate, setIsSavingDate] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    // Fetch agendamentos and equipments to show both equipment and client details
    Promise.all([
      agendamentoService.listar({ page: currentPage, size: PAGE_SIZE, sort: 'dataAgendamento,asc' }),
      equipamentoService.listar({ size: 100 }),
    ])
      .then(([agendamentoRes, equipamentosRes]) => {
        if (!active) return;
        const eqMap: Record<number, EquipamentoResponseDTO> = {};
        equipamentosRes.content.forEach((eq) => {
          eqMap[eq.idEquipamento] = eq;
        });
        setEquipamentosMap(eqMap);

        // Sort agendamentos by dataAgendamento (Requirement 7.1)
        const sortedContent = [...agendamentoRes.content].sort((a, b) => {
          return new Date(a.dataAgendamento).getTime() - new Date(b.dataAgendamento).getTime();
        });

        setPage({
          ...agendamentoRes,
          content: sortedContent,
        });
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setPage(null);
        setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível carregar os agendamentos.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPage, reloadKey]);

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      await agendamentoService.remover(deleteId);
      setDeleteId(null);
      setReloadKey((current) => current + 1);
    } catch (requestError: unknown) {
      window.alert(
        requestError instanceof ApiError ? requestError.message : 'Não foi possível deletar o agendamento.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenQuickDate = (agendamento: AgendamentoResponseDTO) => {
    setQuickDateAgendamento(agendamento);
    // Format to yyyy-MM-ddTHH:mm for datetime-local input
    try {
      const d = new Date(agendamento.dataAgendamento);
      const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setNewDateValue(localIso);
    } catch {
      setNewDateValue('');
    }
  };

  const handleSaveQuickDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDateAgendamento || !newDateValue) return;

    setIsSavingDate(true);
    try {
      await agendamentoService.atualizar(quickDateAgendamento.idAgendamento, {
        dataAgendamento: newDateValue,
        situacaoAgendamento: quickDateAgendamento.situacaoAgendamento,
        descricao: quickDateAgendamento.descricao,
        idEquipamento: quickDateAgendamento.equipamento?.idEquipamento,
      });
      setQuickDateAgendamento(null);
      setReloadKey((prev) => prev + 1);
    } catch (saveError: unknown) {
      window.alert(
        saveError instanceof ApiError ? saveError.message : 'Erro ao atualizar a data do agendamento.'
      );
    } finally {
      setIsSavingDate(false);
    }
  };

  // Columns showing Date, Client and Equipment (Requirement 7.1)
  const columns: ListColumn<AgendamentoResponseDTO>[] = [
    {
      key: 'dataAgendamento',
      header: 'Data do Agendamento',
      render: (item) => (
        <span style={{ fontWeight: 600 }}>{formatDateTime(item.dataAgendamento)}</span>
      ),
    },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (item) => {
        const fullEq = item.equipamento?.idEquipamento ? equipamentosMap[item.equipamento.idEquipamento] : null;
        const clienteNome = fullEq?.cliente?.nome;
        return clienteNome ? (
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{clienteNome}</span>
        ) : (
          <span style={{ opacity: 0.7 }}>Cliente não informado</span>
        );
      },
    },
    {
      key: 'equipamento',
      header: 'Equipamento',
      render: (item) =>
        item.equipamento ? (
          <div>
            <strong>{item.equipamento.tipo}</strong> — {item.equipamento.marca} {item.equipamento.modelo}
          </div>
        ) : (
          '—'
        ),
    },
    {
      key: 'situacaoAgendamento',
      header: 'Situação',
      render: (item) => {
        const colors = getSituacaoBadgeColor(item.situacaoAgendamento);
        return (
          <span
            style={{
              backgroundColor: colors.bg,
              color: colors.color,
              border: `1px solid ${colors.border}`,
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-block',
            }}
          >
            {getSituacaoLabel(item.situacaoAgendamento)}
          </span>
        );
      },
    },
    {
      key: 'descricao',
      header: 'Defeito / Descrição',
      render: (item) => item.descricao || '—',
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.pageMain}>
        <div className={styles.headerSection}>
          <div className={styles.headerTitleWrapper}>
            <span className={styles.headerCategory}>Ordens & Cronograma</span>
            <h1 className={styles.headerTitle}>Agendamentos de Manutenção</h1>
            <p className={styles.headerSubtitle}>
              Listagem ordenada por data de agendamento com dados do cliente e do equipamento associado.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/agendamento/novo" className={styles.primaryLinkButton}>
              + Novo Agendamento
            </Link>
            {page && <span className={styles.badgeCount}>{page.totalElements} agendamentos</span>}
          </div>
        </div>

        {error && (
          <button type="button" onClick={handleRetry} className={styles.retryButton}>
            Tentar novamente
          </button>
        )}

        <DynamicList
          items={page?.content ?? []}
          columns={columns}
          rowKey="idAgendamento"
          loading={loading}
          error={error}
          emptyMessage="Nenhum agendamento cadastrado."
          pagination={
            page
              ? {
                  page: page.number,
                  totalPages: page.totalPages,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
          actions={(agendamento) => (
            <div className={styles.actionGroup}>
              <Link to={`/agendamento/${agendamento.idAgendamento}`} className={styles.actionLink}>
                Detalhes
              </Link>
              <button
                type="button"
                onClick={() => handleOpenQuickDate(agendamento)}
                className={styles.actionLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                title="Alterar data do agendamento (Requisito 7.2)"
              >
                Alterar Data
              </button>
              <Link to={`/agendamento/${agendamento.idAgendamento}/editar`} className={styles.actionLink}>
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(agendamento.idAgendamento)}
                className={styles.deleteButton}
              >
                Excluir
              </button>
            </div>
          )}
        />
      </main>

      {/* Quick Date Change Modal (Requirement 7.2) */}
      {quickDateAgendamento && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            padding: '1rem',
          }}
          onClick={() => !isSavingDate && setQuickDateAgendamento(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              width: 'min(100%, 460px)',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '0.5rem' }}>
              Alterar Data do Agendamento
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8, marginBottom: '1.25rem' }}>
              Selecione a nova data e horário para a manutenção do equipamento{' '}
              <strong>{quickDateAgendamento.equipamento?.modelo}</strong>.
            </p>

            <form onSubmit={handleSaveQuickDate}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Nova Data e Hora:</label>
                <input
                  type="datetime-local"
                  required
                  value={newDateValue}
                  onChange={(e) => setNewDateValue(e.target.value)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--font-size-base)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setQuickDateAgendamento(null)}
                  disabled={isSavingDate}
                  style={{
                    padding: '0.625rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingDate}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isSavingDate ? 'Salvando...' : 'Salvar Nova Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <DeleteConfirmModal
          entityName="agendamento"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}
      <Footer />
    </div>
  );
}
