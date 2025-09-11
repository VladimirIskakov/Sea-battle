import styles from './ship.module.scss';

interface ShipProps {
  length: 1 | 2 | 3 | 4;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const Ship: React.FC<ShipProps> = ({ length, direction = 'vertical', className = '' }) => {
  const shipClass = `
    ${styles.ship}
    ${styles[`ship__type${length}`]}
    ${direction === 'horizontal' ? styles.ship_horizontal : ''}
    ${className}
  `.trim();

  return <div className={shipClass}></div>;
};