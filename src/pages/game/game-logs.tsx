import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './game-logs.module.scss';
import { selectLogsStore } from '@/entities/store/store';

export const GameLogs = () => {
  const logs = useSelector(selectLogsStore);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs.logs]);

  return (
    <div ref={containerRef} className={styles.gameLogs}>
      {logs.logs.length === 0 ? (
        <div className={styles.gameLogs_empty}>Логов пока нет</div>
      ) : (
        logs.logs.map((logElem, index) => (
          <div
            key={index}
            className={`${styles.gameLogs__item} ${styles[`gameLogs__item${logElem.type}`]}`}
          >
            {logElem.log}
          </div>
        ))
      )}
    </div>
  );
};
