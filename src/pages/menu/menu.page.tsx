import { CustomButton } from "@/shared/ui";
import styles from './Menu.module.scss';
import { useNavigate } from "react-router-dom";

export function Menu() {
  const navigate = useNavigate();

  const handleSinglePlayer = () => {
    console.log('Запуск одиночной игры');
    navigate('/fleetdep');
  };


  return (
    <div className={styles.menu}>


        <div className={styles.menu__buttons}>
          <h1 className={styles.menu__title}>Добро пожаловать в Морской Бой!</h1>
          <CustomButton 
            view="primary" 
            size="l" 
            onClick={handleSinglePlayer}
            className={styles.menu__button}
          >
            Одиночная игра
          </CustomButton>
          

        </div>
    </div>
  );
}