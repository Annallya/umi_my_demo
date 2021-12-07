import React from 'react';
import CS from 'classnames';
import styles from './index6.less';

const TestCss6 = () => {
  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.pageHeading}>Ink</h1>
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
        </ul>
      </nav>

      <main className={CS(styles.main, { [styles.title]: true })}>
        <h1>Team collaboration done right</h1>
        <p>
          Thousands of teams from all over the world turn to <b>Ink</b> to communicate and get
          things done.
        </p>
      </main>

      <div className={CS(styles.sideBarTop, { [styles.title]: true })}>
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

      {/* <div className="sidebar-bottom tile centered"> */}
      <div className={CS(styles.sideBarBottom, { [styles.title]: true, [styles.centered]: true })}>
        <small>Starting at</small>
        <div className="cost">
          <span className="cost-currency">$</span>
          <span className="cost-dollars">20</span>
          <span className="cost-cents">.00</span>
        </div>
        <a className="cta-button" href="/pricing">
          Sign up
        </a>
      </div>
    </div>
  );
};

export default TestCss6;
