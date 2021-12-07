import React from 'react';
import styles from './index.less';

const TestCss = () => {
  return (
    <>
      <header>
        <h1>Wombat Coffee Roasters</h1>
        <nav>
          <ul id="main-nav" className={styles.nav}>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/coffees">Coffees</a>
            </li>
            <li>
              <a href="/brewers">Brewers</a>
            </li>
            <li>
              <a href="/specials" className={styles.featured}>
                Specials
              </a>
            </li>
          </ul>
        </nav>
      </header>
      {/* 第二章 */}
      <section className={styles.mainSection}>
        <div className={styles.padded}>
          We have build partnerships with small farms around the world to hand-select beans at the
          peak of season. We then carefully roast in small batches to maximize their potential
        </div>
        <div className={styles.panel}>
          <h2>Single-origin</h2>
          <div className={styles.panelBody}>
            We have built partnerships with small farms around the world to hand-select beans at the
            peak of season. We then carefully roast in <a href="/batch-size">small batches</a> to
            maximize their potential. 11 12 13
          </div>
        </div>
        <aside className={styles.dark}>
          <div className={styles.panel}>
            <h2>Single-origin</h2>
            <div className={styles.panelBody}>
              We have built partnerships with small farms around the world to hand-select beans at
              the peak of season. We then carefully roast in <a href="/batch-size">small batches</a>{' '}
              to maximize their potential. 11 12 13
            </div>
          </div>
        </aside>
      </section>
      <footer className={styles.footer}>
        &copy; 2016 Wombat Coffee Roasters &mdash;
        <a href="/terms-of-use">Terms of use</a>
      </footer>
    </>
  );
};

export default TestCss;
