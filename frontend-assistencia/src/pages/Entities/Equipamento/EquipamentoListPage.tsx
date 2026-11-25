import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal/DeleteConfirmModal';
import { DynamicList } from '../../../components/DynamicList/DynamicList';
import { ApiError } from '../../../services/apiClient';
import { equipamentoService } from '../../../services/equipamentoService';
import type { Page } from '../../../types/api';
import type { EquipamentoResponseDTO } from '../../../types/equipamento';
import { equipamentoListColumns } from '../../../schemas/equipamentoSchema';
import styles from '../List.module.css';

const PAGE_SIZE = 10;

export function EquipamentoListPage() {
  const [page, setPage] = useState<Page<EquipamentoResponseDTO> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    equipamentoService
      .listar({ page: currentPage, size: PAGE_SIZE })
      .then((response) => {
        if (active) setPage(response);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setPage(null);
        setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível carregar os equipamentos.');
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
      await equipamentoService.remover(deleteId);
      setDeleteId(null);
      setReloadKey((current) => current + 1);
    } catch (requestError: unknown) {
      window.alert(
        requestError instanceof ApiError ? requestError.message : 'Não foi possível deletar o equipamento.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.pageMain}>
        <div className={styles.headerSection}>
          <div className={styles.headerTitleWrapper}>
            <span className={styles.headerCategory}>Laboratório & Dispositivos</span>
            <h1 className={styles.headerTitle}>Equipamentos</h1>
            <p className={styles.headerSubtitle}>
              Dispositivos recebidos para diagnóstico e reparo, obrigatoriamente vinculados a seus clientes.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/equipamentos/novo" className={styles.primaryLinkButton}>
              + Novo Equipamento
            </Link>
            {page && <span className={styles.badgeCount}>{page.totalElements} equipamentos</span>}
          </div>
        </div>

        {error && (
          <button type="button" onClick={handleRetry} className={styles.retryButton}>
            Tentar novamente
          </button>
        )}

        <DynamicList
          items={page?.content ?? []}
          columns={equipamentoListColumns}
          rowKey="idEquipamento"
          loading={loading}
          error={error}
          emptyMessage="Nenhum equipamento cadastrado."
          pagination={
            page
              ? {
                  page: page.number,
                  totalPages: page.totalPages,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
          actions={(equipamento) => (
            <div className={styles.actionGroup}>
              <Link to={`/equipamentos/${equipamento.idEquipamento}`} className={styles.actionLink}>
                Detalhes
              </Link>
              <Link to={`/equipamentos/${equipamento.idEquipamento}/editar`} className={styles.actionLink}>
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(equipamento.idEquipamento)}
                className={styles.deleteButton}
              >
                Excluir
              </button>
            </div>
          )}
        />
      </main>

      {deleteId !== null && (
        <DeleteConfirmModal
          entityName="equipamento"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}
      <Footer />
    </div>
  );
}
