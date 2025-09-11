import React from 'react';
import styles from './icon-column-button.module.scss';

interface IconColumnButtonProps {
  icon: React.ReactNode; // Иконка (может быть SVG, img или React-компонент)
  text: string; // Текст под иконкой
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const IconColumnButton: React.FC<IconColumnButtonProps> = ({
  icon,
  text,
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      className={`${styles.iconColumnButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <div className={styles.iconColumnButton__icon}>
        {icon}
      </div>
      <span className={styles.iconColumnButton__text}>
        {text}
      </span>
    </button>
  );
};