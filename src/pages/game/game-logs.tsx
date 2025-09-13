import { useSelector } from 'react-redux';
import styles from './game-logs.module.scss'; // или ваш файл стилей
import { selectLogsStore } from '@/entities/store/store';
import { useEffect } from 'react';

export const GameLogs = () => {

  const logs = useSelector(selectLogsStore);

  useEffect(()=>{
        console.log(logs)
  }, [logs]
)

  return (
    <div className={styles.gameLogs}>
      {logs.logs.length === 0 ? (
        <div className={styles.gameLogEmpty}>Логов пока нет</div>
      ) : (
        logs.logs.map((log, index) => (
          <div key={index} className={styles.gameLogItem}>
            {log}
          </div>
        ))
      )}
    </div>
  );
};
