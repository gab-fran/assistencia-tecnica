import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DeleteConfirmModal } from '../../../components/DeleteConfirmModal/DeleteConfirmModal';
import { DynamicList } from '../../../components/DynamicList/DynamicList';
import { ApiError } from '../../../services/apiClient';
import { clienteService } from '../../../services/clienteService';
import type { Page } from '../../../types/api';
import type { ClienteResponseDTO } from '../../../types/cliente';
import { clienteListColumns } from '../../../schemas/clienteSchema';
import styles from '../List.module.css';

const PAGE_SIZE = 10;

export function ClienteListPage() {
  const [page, setPage] = useState<Page<ClienteResponseDTO> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search feature (Requirement 5.2)
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    // If search term is applied, we can fetch all or search by email/cpf or client filter
    clienteService
      .listar({ page: currentPage, size: PAGE_SIZE, sort: 'nome,asc' })
      .then(async (response) => {
        if (!active) return;
        if (appliedSearch.trim()) {
          const query = appliedSearch.trim().toLowerCase();
          const filtered = response.content.filter(
            (c) =>
              c.nome.toLowerCase().includes(query) ||
              c.email.toLowerCase().includes(query) ||
              c.cpf.includes(query) ||
              c.celular.includes(query)
          );
          setPage({
            ...response,
            content: filtered,
            totalElements: filtered.length,
          });
        } else {
          setPage(response);
        }
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setPage(null);
        setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível carregar os clientes.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPage, reloadKey, appliedSearch]);

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
    setCurrentPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setAppliedSearch('');
    setCurrentPage(0);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setIsDeleting(true);
    try {
      await clienteService.remover(deleteId);
      setDeleteId(null);
      setReloadKey((current) => current + 1);
    } catch (requestError: unknown) {
      window.alert(
        requestError instanceof ApiError
          ? requestError.message
          : 'Não foi possível deletar o cliente. Verifique se existem equipamentos vinculados.'
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
            <span className={styles.headerCategory}>Atendimento & Cadastro</span>
            <h1 className={styles.headerTitle}>Clientes</h1>
            <p className={styles.headerSubtitle}>
              Gerenciamento dos clientes cadastrados, telefones de contato e conformidade LGPD.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/clientes/novo" className={styles.primaryLinkButton}>
              + Novo Cliente
            </Link>
            {page && <span className={styles.badgeCount}>{page.totalElements} clientes</span>}
          </div>
        </div>

        {/* Search bar with confirmation (Requirement 5.2) */}
        <form onSubmit={handleSearchSubmit} className={styles.searchBarContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar cliente por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            Buscar
          </button>
          {appliedSearch && (
            <button type="button" onClick={handleClearSearch} className={styles.clearSearchButton}>
              Limpar busca
            </button>
          )}
        </form>

        {error && (
          <button type="button" onClick={handleRetry} className={styles.retryButton}>
            Tentar novamente
          </button>
        )}

        <DynamicList
          items={page?.content ?? []}
          columns={clienteListColumns}
          rowKey="idCliente"
          loading={loading}
          error={error}
          emptyMessage={appliedSearch ? 'Nenhum cliente encontrado para o termo pesquisado.' : 'Nenhum cliente cadastrado.'}
          pagination={
            page
              ? {
                  page: page.number,
                  totalPages: page.totalPages,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
          actions={(cliente) => (
            <div className={styles.actionGroup}>
              <Link to={`/clientes/${cliente.idCliente}`} className={styles.actionLink}>
                Detalhes
              </Link>
              <Link to={`/clientes/${cliente.idCliente}/editar`} className={styles.actionLink}>
                Editar
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(cliente.idCliente)}
                className={styles.deleteButton}
                title="Excluir cliente"
              >
                Excluir
              </button>
            </div>
          )}
        />
      </main>

      {deleteId !== null && (
        <DeleteConfirmModal
          entityName="cliente"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      )}
      <Footer />
    </div>
  );
}
