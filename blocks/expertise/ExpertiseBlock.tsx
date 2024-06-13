// blocks/expertise/ExpertiseBlock.tsx
import React from 'react';
import styles from './ExpertiseBlock.module.css'; // Assuming you will create a CSS module for styling

export type ExpertiseBlockProps = {};

const ExpertiseBlock: React.FC<ExpertiseBlockProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>X-PERTISE.</h1>
        <p>Découvrez les technologies innovantes développées avec X-Squad.</p>
        <button className={styles.button}>Envoyer un devis</button>
      </div>
      <div className={styles.logos}>
        <img src="/path/to/oney-logo.png" alt="Oney" />
        <img src="/path/to/django-logo.png" alt="Django" />
        <img src="/path/to/hyvibe-logo.png" alt="HyVibe" />
        <img src="/path/to/renault-logo.png" alt="Renault" />
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Oney</h3>
          <p>-70% de réduction de la dette technique et x4 sur la taille de l'équipe technique en 1 an.</p>
        </div>
        <div className={styles.card}>
          <h3>Django</h3>
          <p>Redonner le pouvoir à ses dépenses à plus de 100 000 personnes avec un paiement fractionné en 3 fois.</p>
        </div>
        <div className={styles.card}>
          <h3>MyVibe</h3>
          <p>Collecter les données de navigation sur les 100 modèles de véhicules de la flotte du losange vers Automate, le programme open data européen.</p>
        </div>
        <div className={styles.card}>
          <h3>Renaud</h3>
          <p>Conception de l'application de la marque de Smart Guitare au service de la créativité de plus +4900 guitaristes dont +30 mondialement connus.</p>
        </div>
      </div>
    </div>
  );
};

export default ExpertiseBlock;
