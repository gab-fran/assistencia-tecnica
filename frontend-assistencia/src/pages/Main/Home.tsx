import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { authService } from "../../services/authService";
import { getAccessToken, getUserData } from "../../services/apiConfig";
import { homeService } from "../../services/homeService";
import styles from "./Home.module.css";
import { RoleUsuario } from "../../enums/roleUsuario";

function Home() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isAuthenticated] = useState(() => {
    const token = getAccessToken();
    return !!(token && authService.checkTokenExpiry());
  });

  const [user] = useState(() => getUserData());

  useEffect(() => {
    let isMounted = true;

    homeService
      .verificarApi()
      .then(() => {
        if (isMounted) setApiStatus('online');
      })
      .catch(() => {
        if (isMounted) setApiStatus('offline');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.homeContainer}>
      <NavBar />

      <main className={styles.homeMain}>
        {!isAuthenticated ? (
          /* ==========================================================================
             DESLOGADO: PORTAL MODERNO DA ASSISTÊNCIA TÉCNICA
             ========================================================================== */
          <>
            <section className={styles.heroSection}>
              <div className={styles.heroContent}>
                <div className={styles.heroBadge}>
                  <span className={styles.badgePulse}></span>
                  <i className="pi pi-bolt" style={{ fontSize: '0.85rem' }}></i>
                  <span>SISTEMA DE GESTÃO ESPECIALIZADA</span>
                </div>

                <h1 className={styles.heroTitle}>
                  Controle Inteligente para <br />
                  <span className={styles.titleGradient}>Assistência Técnica</span> & Hardware
                </h1>

                <p className={styles.heroDescription}>
                  Plataforma unificada de alto desempenho para gestão de ordens de serviço, triagem de
                  equipamentos, agendamentos com cronograma em tempo real e proteção de dados em conformidade com a LGPD.
                </p>

                <div className={styles.heroActions}>
                  <Link to="/login" className={styles.primaryCtaButton}>
                    <span>Acessar o Sistema</span>
                    <i className="pi pi-arrow-right"></i>
                  </Link>
                  <a href="#recursos" className={styles.secondaryCtaButton}>
                    <i className="pi pi-compass"></i>
                    <span>Ver Módulos</span>
                  </a>
                </div>

                <div className={styles.heroStatsRow}>
                  <div className={styles.heroStatItem}>
                    <span className={styles.statNumber}>100%</span>
                    <span className={styles.statLabel}>Conforme LGPD</span>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.heroStatItem}>
                    <span className={styles.statNumber}>24/7</span>
                    <span className={styles.statLabel}>Rastreabilidade</span>
                  </div>
                  <div className={styles.statDivider}></div>
                  <div className={styles.heroStatItem}>
                    <span className={styles.statNumber}>Zero</span>
                    <span className={styles.statLabel}>Extravio de dados</span>
                  </div>
                </div>
              </div>

              {/* Showcase Card Preview */}
              <div className={styles.showcaseWrapper}>
                <div className={styles.showcaseCard}>
                  <div className={styles.showcaseCardHeader}>
                    <div className={styles.windowDots}>
                      <span className={styles.dotRed}></span>
                      <span className={styles.dotYellow}></span>
                      <span className={styles.dotGreen}></span>
                    </div>
                    <span className={styles.showcaseTag}>Painel TechFix • V2.0</span>
                  </div>

                  <div className={styles.showcaseBody}>
                    <div className={styles.previewMetricRow}>
                      <div className={styles.previewMetricCard}>
                        <div className={styles.previewMetricIcon} style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                          <i className="pi pi-desktop"></i>
                        </div>
                        <div className={styles.previewMetricInfo}>
                          <span className={styles.previewMetricLabel}>Equipamentos</span>
                          <span className={styles.previewMetricValue}>Triagem Ativa</span>
                        </div>
                      </div>

                      <div className={styles.previewMetricCard}>
                        <div className={styles.previewMetricIcon} style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4' }}>
                          <i className="pi pi-calendar"></i>
                        </div>
                        <div className={styles.previewMetricInfo}>
                          <span className={styles.previewMetricLabel}>Cronograma</span>
                          <span className={styles.previewMetricValue}>SLA Ordenado</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.previewTimelineItem}>
                      <div className={styles.timelineIcon}>
                        <i className="pi pi-check"></i>
                      </div>
                      <div className={styles.timelineContent}>
                        <strong>Proteção Criptográfica Ativa</strong>
                        <span>Hash irreversível de senhas & CPFs cifrados</span>
                      </div>
                    </div>

                    <div className={styles.previewTimelineItem}>
                      <div className={styles.timelineIcon} style={{ background: '#06B6D4' }}>
                        <i className="pi pi-sync"></i>
                      </div>
                      <div className={styles.timelineContent}>
                        <strong>Sincronização com API Backend</strong>
                        <span>Sessões autenticadas com tokens seguros</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Módulos & Recursos em Destaque */}
            <section id="recursos" className={styles.featuresSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionBadge}>Recursos Integrados</span>
                <h2 className={styles.sectionTitle}>Tudo o que sua equipe precisa para operar</h2>
                <p className={styles.sectionSubtitle}>
                  Arquitetura construída para oferecer agilidade no balcão e segurança no laboratório técnico.
                </p>
              </div>

              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
                    <i className="pi pi-users"></i>
                  </div>
                  <h3>Cadastro de Clientes</h3>
                  <p>Controle unificado de clientes com busca instantânea por nome, e-mail e validação rigorosa de CPF.</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #0EA5E9, #0284C7)' }}>
                    <i className="pi pi-desktop"></i>
                  </div>
                  <h3>Equipamentos & Hardware</h3>
                  <p>Vínculo obrigatório com o cliente proprietário, histórico de marca, modelo, tipo e número de série.</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #06B6D4, #0891B2)' }}>
                    <i className="pi pi-calendar-plus"></i>
                  </div>
                  <h3>Ordens & Agendamentos</h3>
                  <p>Visualização cronológica por data de atendimento, alteração rápida de horário e controle de status.</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIcon} style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>
                    <i className="pi pi-shield"></i>
                  </div>
                  <h3>Segurança & LGPD</h3>
                  <p>Blindagem de dados confidenciais, controle de permissões por perfil (Admin/Funcionário) e auditoria.</p>
                </div>
              </div>
            </section>

            {/* Banner de Segurança LGPD */}
            <section className={styles.securityBanner}>
              <div className={styles.securityIconBox}>
                <i className="pi pi-lock"></i>
              </div>
              <div className={styles.securityTextBox}>
                <h3>Segurança Máxima e Conformidade com a LGPD</h3>
                <p>
                  Todos os dados sensíveis dos clientes e equipamentos recebem tratamento confidencial.
                  As senhas dos colaboradores contam com criptografia hash salgada e o acesso aos módulos requer
                  autenticação com sessão temporizada via JWT.
                </p>
              </div>
            </section>
          </>
        ) : (
          /* ==========================================================================
             LOGADO: DASHBOARD OPERACIONAL DO COLABORADOR
             ========================================================================== */
          <>
            <section className={styles.dashboardHero}>
              <div className={styles.dashboardWelcome}>
                <div className={styles.dashboardPill}>
                  <span className={styles.badgePulse}></span>
                  <span>PAINEL OPERACIONAL ATIVO</span>
                </div>
                <h1 className={styles.dashboardTitle}>
                  Olá, {user.nome || 'Colaborador'}!
                  <span className={styles.roleTag}>
                    {user.role === RoleUsuario.ADMINISTRADOR ? 'Administrador' : 'Técnico Especialista'}
                  </span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Bem-vindo à central de atendimento. Selecione um módulo operacional ou use os atalhos rápidos abaixo.
                </p>
              </div>

              <div className={styles.quickActionsContainer}>
                <span className={styles.quickActionsLabel}>Ações Rápidas:</span>
                <div className={styles.quickButtonsRow}>
                  <Link to="/clientes/novo" className={styles.quickBtnPrimary}>
                    <i className="pi pi-plus"></i>
                    <span>Novo Cliente</span>
                  </Link>
                  <Link to="/equipamentos/novo" className={styles.quickBtn}>
                    <i className="pi pi-desktop"></i>
                    <span>Novo Equipamento</span>
                  </Link>
                  <Link to="/agendamento/novo" className={styles.quickBtn}>
                    <i className="pi pi-calendar-plus"></i>
                    <span>Novo Agendamento</span>
                  </Link>
                  {user.role === RoleUsuario.ADMINISTRADOR && (
                    <Link to="/usuarios/novo" className={styles.quickBtnAdmin}>
                      <i className="pi pi-user-plus"></i>
                      <span>Novo Usuário</span>
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* Grid dos Módulos Principais */}
            <section className={styles.moduleGrid}>
              <div className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleIcon} style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}>
                    <i className="pi pi-users"></i>
                  </div>
                  <span className={styles.moduleChip}>Atendimento</span>
                </div>
                <h2 className={styles.moduleTitle}>Clientes</h2>
                <p className={styles.moduleDesc}>
                  Consulta completa da base de clientes cadastrados, com pesquisa ágil por termo e formulário de cadastro protegido.
                </p>
                <div className={styles.moduleFooter}>
                  <Link to="/clientes" className={styles.moduleLink}>
                    <span>Acessar Clientes</span>
                    <i className="pi pi-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleIcon} style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9' }}>
                    <i className="pi pi-desktop"></i>
                  </div>
                  <span className={styles.moduleChip}>Hardware</span>
                </div>
                <h2 className={styles.moduleTitle}>Equipamentos</h2>
                <p className={styles.moduleDesc}>
                  Gestão e triagem de aparelhos (notebooks, smartphones, placas e consoles), vinculados obrigatoriamente a cada cliente.
                </p>
                <div className={styles.moduleFooter}>
                  <Link to="/equipamentos" className={styles.moduleLink}>
                    <span>Acessar Equipamentos</span>
                    <i className="pi pi-arrow-right"></i>
                  </Link>
                </div>
              </div>

              <div className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <div className={styles.moduleIcon} style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4' }}>
                    <i className="pi pi-calendar"></i>
                  </div>
                  <span className={styles.moduleChip}>Cronograma</span>
                </div>
                <h2 className={styles.moduleTitle}>Agendamentos</h2>
                <p className={styles.moduleDesc}>
                  Ordens de serviço organizadas por ordem cronológica, alteração dinâmica de datas e atualização de situação técnica.
                </p>
                <div className={styles.moduleFooter}>
                  <Link to="/agendamento" className={styles.moduleLink}>
                    <span>Acessar Agendamentos</span>
                    <i className="pi pi-arrow-right"></i>
                  </Link>
                </div>
              </div>

              {user.role === RoleUsuario.ADMINISTRADOR && (
                <div className={`${styles.moduleCard} ${styles.adminModuleCard}`}>
                  <div className={styles.moduleHeader}>
                    <div className={styles.moduleIcon} style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' }}>
                      <i className="pi pi-shield"></i>
                    </div>
                    <span className={styles.moduleChipAdmin}>Exclusivo Admin</span>
                  </div>
                  <h2 className={styles.moduleTitle}>Gestão de Usuários</h2>
                  <p className={styles.moduleDesc}>
                    Administração dos membros da equipe técnica, controle de perfis de acesso e redefinição de credenciais de acesso.
                  </p>
                  <div className={styles.moduleFooter}>
                    <Link to="/usuarios" className={styles.moduleLink}>
                      <span>Acessar Usuários</span>
                      <i className="pi pi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* Live Backend Connection Status */}
        <section className={styles.statusBar}>
          <div className={styles.statusContent}>
            <span className={`${styles.statusDot} ${styles[apiStatus]}`}></span>
            <span className={styles.statusText}>
              {apiStatus === 'checking' && 'Verificando conectividade com o servidor backend...'}
              {apiStatus === 'online' && 'Servidor Backend Operacional — API TechFix Online'}
              {apiStatus === 'offline' && 'Servidor Backend Indisponível — Verifique se a aplicação Spring Boot está em execução na porta 8080'}
            </span>
          </div>
          <span className={styles.systemVersion}>TechFix v2.0 • LGPD Ready</span>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;