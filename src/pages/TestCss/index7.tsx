import React from 'react';
import styles from './index7.less';

export default function TestCss7() {
  return (
    <div className={styles.container}>
      <main className={styles.colMain}>
        <nav>
          <div className={styles.dropdown}>
            <div className={styles.dropdownLabel}>Main Menu</div>
            <div className={styles.dropdownMenu}>
              <ul className={styles.submenu}>
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
                  <a href="/specials">Specials</a>
                </li>
                <li>
                  <a href="/about">About us</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <h1>Wombat Coffee Roasters</h1>
      </main>
      <aside className={styles.colSider}>
        <div className={styles.affix}>
          <ul className={styles.submenu}>
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
              <a href="/specials">Specials</a>
            </li>
            <li>
              <a href="/about">About us</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
