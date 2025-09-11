import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  view?: 'primary' | 'secondary' | 'ghost';
  size?: 's' | 'm' | 'l';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CustomButton: React.FC<ButtonProps> = ({
  children,
  view = 'primary',
  size = 'm',
  disabled = false,
  onClick,
  className = ''
}) => {
  const buttonClass = `
    ${styles.button}
    ${styles[`button_view_${view}`]}
    ${styles[`button_size_${size}`]}
    ${disabled ? styles.button_disabled : ''}
    ${className}
  `.trim();

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className={styles.button__content}>
        {children}
      </span>
    </button>
  );
};