import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { clienteService } from '../../../services/clienteService';
import type { ClienteResponseDTO } from '../../../types/cliente';
import { clienteUpdateSchema, type ClienteUpdateFormData } from '../../../schemas/clienteSchema';
import { formatCelular, formatCpf } from '../../../utils/formatters';
import styles from '../Details.module.css';

type ClienteDetailsPageProps = {
  edit?: boolean;
};

export function ClienteDetailsPage({ edit = false }: ClienteDetailsPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const clienteId = Number(id);
  const invalidId = !Number.isInteger(clienteId) || clienteId <= 0;

  useEffect(() => {
    if (invalidId) return;

    clienteService
      .buscarPorId(clienteId)
      .then(setCliente)
      .catch((requestError: unknown) => {
        setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível carregar o cliente.');
      })
      .finally(() => setLoading(false));
  }, [invalidId, clienteId]);

  const updateFields: FieldConfig<ClienteUpdateFormData>[] = [
    { name: 'nome', label: 'Nome Completo', required: true, maxLength: 20 },
    { name: 'email', label: 'E-mail', type: 'email', required: true, maxLength: 255 },
    { name: 'cpf', label: 'CPF (11 dígitos)', required: false, maxLength: 14 },
    { name: 'celular', label: 'Celular (11 dígitos)', required: false, maxLength: 15 },
  ];

  const handleUpdate = async (data: ClienteUpdateFormData) => {
    if (!cliente) return;
    setError('');

    try {
      const updated = await clienteService.atualizar(cliente.idCliente, data);
      setCliente(updated);
      navigate(`/clientes/${cliente.idCliente}`);
    } catch (requestError: unknown) {
      setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível atualizar o cliente.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.pageMain}>
        <div className={styles.headerSection}>
          <Link to="/clientes" className={styles.backLink}>
            ← Voltar para clientes
          </Link>
          <h1 className={styles.headerTitle}>
            {edit ? 'Editar Dados do Cliente' : 'Ficha Cadastral do Cliente'}
          </h1>
        </div>

        {invalidId && <p className={styles.errorMessage} role="alert">Identificador de cliente inválido.</p>}
        {!invalidId && loading && <p>Carregando dados do cliente...</p>}
        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        {!invalidId && !loading && cliente && (
          edit ? (
            <DynamicForm
              schema={clienteUpdateSchema}
              fields={updateFields}
              defaultValues={{
                nome: cliente.nome,
                email: cliente.email,
                cpf: cliente.cpf,
                celular: cliente.celular,
              }}
              onSubmit={handleUpdate}
              submitText="Salvar Alterações"
            />
          ) : (
            <div className={styles.cardContainer}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>ID do Cliente</span>
                <span className={styles.infoValue}>#{cliente.idCliente}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Nome Completo</span>
                <span className={styles.infoValue}>{cliente.nome}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>E-mail</span>
                <span className={styles.infoValue}>{cliente.email}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>CPF (Protegido por Criptografia)</span>
                <span className={styles.infoValue}>{formatCpf(cliente.cpf)}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Celular de Contato</span>
                <span className={styles.infoValue}>{formatCelular(cliente.celular)}</span>
              </div>

              <div className={styles.cardActions}>
                <Link to={`/clientes/${cliente.idCliente}/editar`} className={styles.primaryButton}>
                  Editar Cliente
                </Link>
                <Link to={`/equipamentos/novo?idCliente=${cliente.idCliente}`} className={styles.secondaryButton}>
                  + Associar Equipamento
                </Link>
              </div>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}
