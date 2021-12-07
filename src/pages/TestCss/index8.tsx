import React from 'react';
import CS from 'classnames';
import styles from './index8.less';

export default function TestCss8() {
  const handleClickMenu = () => {
    // setVisible(!visible);
    const menu = document.getElementById('main-menu');
    menu?.classList.toggle('isOpen');
  };

  return (
    <>
      <header id="id" className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Wombat Coffee Roasters</h1>
          <div className={styles.slogan}>We love coffee</div>
        </div>
      </header>

      <nav id="main-menu" className={styles.menu}>
        {/* eslint-disable-next-line */}
        <button className={styles.menuToggle} onClick={handleClickMenu}>
          toggle menu
        </button>
        <div
          className={CS(styles.menuDropdown, {
            // [styles.menuIsOpen]: visible,
            // [styles.menuIsClose]: !visible,
          })}
        >
          <ul className={styles.navMenu}>
            <li>
              <a href="/about.html">About</a>
            </li>
            <li>
              <a href="/shop.html">Shop</a>
            </li>
            <li>
              <a href="/menu.html">Menu</a>
            </li>
            <li>
              <a href="/brew.html">Brew</a>
            </li>
          </ul>
        </div>
      </nav>

      <aside id="hero" className={styles.hero}>
        Welcome to Wombat Coffee Roasters! We are passionate about our craft, striving to bring you
        the best hand-crafted coffee in the city.
      </aside>

      <main id="main">
        <div className={styles.rows}>
          <section className={styles.column}>
            <h2 className={styles.subtitle}>Single-origin</h2>
            <p>
              We have built partnerships with small farms around the world to hand-select beans at
              the peak of season. We then carefully roast in
              <a href="/batch-size.html">small batches</a>
              to maximize their potential.
            </p>
          </section>
          <section className={styles.column}>
            <h2 className={styles.subtitle}>Blends</h2>
            <p>
              Our tasters have put together a selection of carefully balanced blends. Our famous
              <a href="/house-blend.html">house blend</a>
              is available year round.
            </p>
          </section>
          <section className={styles.column}>
            <h2 className={styles.subtitle}>Brewing Equipment</h2>
            <p>
              We offer our favorite kettles, French presses, and pour-over cones. Come to one of our{' '}
              <a href="/classes.html">brewing classes</a> to learn how to brew the perfect pour-over
              cup.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
