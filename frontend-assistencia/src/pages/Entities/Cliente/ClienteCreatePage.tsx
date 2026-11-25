import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer/Footer';
import { DynamicForm, type FieldConfig } from '../../../components/DynamicForm/DynamicForm';
import { ApiError } from '../../../services/apiClient';
import { clienteService } from '../../../services/clienteService';
import { clienteCreateSchema, type ClienteCreateFormData } from '../../../schemas/clienteSchema';
import styles from '../Create.module.css';

export function ClienteCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const createFields: FieldConfig<ClienteCreateFormData>[] = [
    { name: 'nome', label: 'Nome Completo', required: true, maxLength: 20, placeholder: 'Ex: João da Silva' },
    { name: 'email', label: 'E-mail', type: 'email', required: true, maxLength: 255, placeholder: 'cliente@email.com' },
    { name: 'cpf', label: 'CPF (somente números - 11 dígitos)', required: true, maxLength: 14, placeholder: '12345678901' },
    { name: 'celular', label: 'Celular (com DDD - 11 dígitos)', required: true, maxLength: 15, placeholder: '11987654321' },
  ];

  const handleCreate = async (data: ClienteCreateFormData) => {
    setError('');
    try {
      const cliente = await clienteService.cadastrar(data);
      navigate(`/clientes/${cliente.idCliente}`);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof ApiError ? requestError.message : 'Não foi possível cadastrar o cliente.'
      );
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
          <h1 className={styles.headerTitle}>Novo Cliente</h1>
          <p className={styles.headerSubtitle}>
            Cadastre os dados do cliente com proteção de CPF por criptografia e conformidade LGPD.
          </p>
        </div>

        {error && <p className={styles.errorMessage} role="alert">{error}</p>}

        <DynamicForm
          schema={clienteCreateSchema}
          fields={createFields}
          onSubmit={handleCreate}
          submitText="Salvar Cliente"
        />
      </main>
      <Footer />
    </div>
  );
}
