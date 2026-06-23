import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './index.module.css';

const cards = [
  {
    title: 'PKeyMaster',
    description:
      'An open-source toolkit for Microsoft product key validation, CID retrieval, and advanced key scanning.',
    to: '/pkeymaster',
  },
  {
    title: 'Guides',
    description:
      'In-depth guides for Microsoft products, from modern releases to legacy systems.',
    to: '/guides',
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.hero)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </header>
      <main>
        <div className={styles.cardSection}>
          <div className="container">
            <div className={styles.grid}>
              {cards.map((card, i) => (
                <Link key={i} to={card.to} className={styles.card}>
                  <h2 className={styles.cardTitle}>{card.title}</h2>
                  <p className={styles.cardDescription}>{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
