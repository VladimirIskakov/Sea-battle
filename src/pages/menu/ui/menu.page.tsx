import { CustomButton, LanguageSelector } from "@/shared/ui";
import styles from './Menu.module.scss';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Menu() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSinglePlayer = () => {
    console.log('Запуск одиночной игры');
    navigate('/fleetdep');
  };


  return (
    <div className={styles.menu}>
      <LanguageSelector />


        <div className={styles.menu__buttons}>
          <h1 className={styles.menu__title}>{t("welcome")}</h1>
          <CustomButton 
            view="primary" 
            size="l" 
            onClick={handleSinglePlayer}
            className={styles.menu__button}
          >
            {t("singlePlayer")}
          </CustomButton>
          

        </div>
    </div>
  );
}