import { type JSX } from "react";
import styles from "./Footer.module.css";

function Footer(): JSX.Element {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.titleRow}>
            <span className={styles.brandIcon}>
              <i className="pi pi-bolt"></i>
            </span>
            <h2 className={styles.footerTitle}>TechFix Assistência Técnica</h2>
          </div>
          <p className={styles.footerDescription}>
            Plataforma informatizada de gestão de ordens de serviço, triagem de equipamentos e cronograma de manutenção.
          </p>
        </div>

        <div className={styles.footerRight}>
          <div className={styles.securityTag}>
            <i className="pi pi-shield"></i>
            <span>Conforme LGPD & Proteção Criptográfica</span>
          </div>
          <p className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} TechFix Corporation. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;