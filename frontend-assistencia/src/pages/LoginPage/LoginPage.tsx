import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicForm } from '../../components/DynamicForm/DynamicForm';
import { loginSchema, loginFields, type LoginFormData } from '../../schemas/authSchema';
import { authService } from '../../services/authService';
import { ApiError } from '../../services/apiClient';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [defaultValues, setDefaultValues] = useState<Partial<LoginFormData>>({});
  const [formKey, setFormKey] = useState(0);

  const handleLogin = async (data: LoginFormData) => {
    setLoginError('');

    try {
      await authService.login({
        email: data.email,
        password: data.password,
      });

      navigate('/');
    } catch (error) {
      if (error instanceof ApiError && [401, 403].includes(error.status)) {
        setLoginError('E-mail ou senha inválidos. Verifique suas credenciais.');
      } else if (error instanceof ApiError && error.status === 0) {
        setLoginError('Não foi possível conectar com o servidor. Verifique se o backend está em execução.');
      } else {
        setLoginError('Ocorreu um erro no servidor. Tente novamente mais tarde.');
      }
    }
  };

  const handleQuickFill = (email: string, pass: string) => {
    setLoginError('');
    setDefaultValues({ email, password: pass });
    setFormKey((k) => k + 1);
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.loginMain}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <div className={styles.iconCircle}>
              <i className="pi pi-shield"></i>
            </div>
            <h2 className={styles.loginTitle}>Acesso Seguro TechFix</h2>
            <p className={styles.loginSubtitle}>
              Digite suas credenciais corporativas para gerenciar ordens e equipamentos
            </p>
          </div>

          {loginError && (
            <div className={styles.errorMessage} role="alert">
              <i className="pi pi-exclamation-triangle"></i>
              <span>{loginError}</span>
            </div>
          )}

          <DynamicForm
            key={formKey}
            schema={loginSchema}
            fields={loginFields}
            onSubmit={handleLogin}
            defaultValues={defaultValues}
            submitText="Entrar na Plataforma"
            className={styles.loginFormCustom}
            fieldClassName={styles.inputWrapper}
            submitButtonClassName={styles.btnLogin}
          />

          <section className={styles.testUsersCard} aria-labelledby="test-users-title">
            <div className={styles.testHeaderRow}>
              <span className={styles.testBadge}>Ambiente de Avaliação</span>
              <span className={styles.testHint}>Clique para preencher:</span>
            </div>

            <div className={styles.testUserButtons}>
              <button
                type="button"
                className={styles.testUserBtn}
                onClick={() => handleQuickFill('admin@email.com', '123456789')}
              >
                <div className={styles.testUserRole}>
                  <i className="pi pi-shield"></i>
                  <strong>Administrador</strong>
                </div>
                <span className={styles.testUserEmail}>admin@email.com</span>
              </button>

              <button
                type="button"
                className={styles.testUserBtn}
                onClick={() => handleQuickFill('funcionario@email.com', '123456789')}
              >
                <div className={styles.testUserRole}>
                  <i className="pi pi-user"></i>
                  <strong>Funcionário Técnico</strong>
                </div>
                <span className={styles.testUserEmail}>funcionario@email.com</span>
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}