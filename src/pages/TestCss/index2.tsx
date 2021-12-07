import React from 'react';
import CS from 'classnames';
import styles from './index2.less';

const TestCss1 = () => {
  return (
    <div className={styles.container}>
      <header>
        <h1>Franklin Running Club</h1>
      </header>
      <main className={CS(styles.main, { [styles.clearfix]: true })}>
        <h2>Running tips</h2>
        <div className={styles.rows}>
          <div className={styles.column6}>
            <div className={styles.media}>
              <img className={styles.mediaImage} src="shoes.png" alt="暂无" />
              <div className={styles.mediaBody}>
                <h4>Strength</h4>
                <p>
                  Strength training is an important part of injury prevention. Focus on your
                  core&mdash; especially your abs and glutes.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.column6}>
            <div className={styles.media}>
              <img className={styles.mediaImage} src="shoes.png" alt="暂无" />
              <div className={styles.mediaBody}>
                <h4>Cadence</h4>
                <p>
                  Check your stride turnover. The most efficient runners take about 180 steps per
                  minute.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rows}>
          <div className={styles.column6}>
            <div className={styles.media}>
              <img className={styles.mediaImage} src="shoes.png" alt="暂无" />
              <div className={styles.mediaBody}>
                <h4>Change it up</h4>
                <p>
                  Don't run the same every time you hit the road. Vary your pace, and vary the
                  distance of your runs.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.column6}>
            <div className={styles.media}>
              <img className={styles.mediaImage} src="shoes.png" alt="暂无" />
              <div className={styles.mediaBody}>
                <h4>Focus on form</h4>
                <p>
                  Run tall but relaxed. Your feet should hit the ground beneath your hips, not out
                  in front of you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestCss1;
