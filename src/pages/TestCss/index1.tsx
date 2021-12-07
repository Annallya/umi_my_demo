import React from 'react';
import styles from './index1.less';

const TestCss1 = () => {
  return (
    <>
      <header>
        <h1>Franklin Running Club</h1>
      </header>
      <div className={styles.container}>
        <main className={styles.main}>
          <h2>Come join us</h2>
          <p>
            The Franklin Running club meets at 6:00pm every Thursday at the town square. Runs are
            three to five miles, at your own pace.
          </p>
        </main>
        <aside className={styles.sidebar}>
          <a href="/twitter" className={styles.buttonLink}>
            follow us on Twitter
          </a>
          <a href="/facebook" className={styles.buttonLink}>
            like us on Facebook
          </a>

          <a href="/sponsors" className={styles.sponsorLink}>
            become a sponsor
          </a>
        </aside>
      </div>
    </>
  );
};

export default TestCss1;
