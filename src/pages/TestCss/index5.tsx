import React from 'react';
import CS from 'classnames';
import styles from './index5.less';

const TestCss5 = () => {
  return (
    <div className={styles.container}>
      <header>
        <h1>Ink</h1>
      </header>

      <nav>
        <ul className={styles.siteNav}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/features">Features</a>
          </li>
          <li>
            <a href="/pricing">Pricing</a>
          </li>
          <li>
            <a href="/support">Support</a>
          </li>
          <li className={styles.navRight}>
            <a href="/about">About</a>
          </li>
        </ul>{' '}
      </nav>

      <main className={styles.flex}>
        <div className={CS(styles.columnMain, { [styles.title]: true })}>
          <h1>Team collaboration done right</h1>
          <p>
            Thousands of teams from all over the world turn to <b>Ink</b> to communicate and get
            things done.
          </p>
        </div>

        <div className={styles.columnSideBar}>
          <div className={styles.title}>
            <form className={styles.loginForm}>
              <h3>Login</h3>
              <p>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" name="username" />
              </p>
              <p>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" />
              </p>
              <button type="submit">Login</button>
            </form>
          </div>
          <div className={CS(styles.title, { [styles.centered]: true })}>
            <small>Starting at</small>
            <div className={styles.cost}>
              <span className={styles.costCurrency}>$</span>
              <span className={styles.costDollars}>20</span>
              <span className={styles.costCents}>.00</span>
            </div>
            <a className={styles.ctaButton} href="/pricing">
              Sign up{' '}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestCss5;
