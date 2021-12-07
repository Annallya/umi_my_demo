import React from 'react';
import styles from './index11.less';

export default function TestCss11() {
  return (
    <div className={styles.test}>
      {/* <div className={styles.fide}>This is a box with a shadow</div> */}
      {/* eslint-disable-next-line */}
      {/* <button className={styles.button}>Sign up now</button> */}

      {/* <div className={styles.blend}>
        <h1>Ursa Major</h1>
      </div> */}
      <span className={styles.wrapper}>
        <div className={styles.inner}>测试文字测试文字</div>
      </span>
    </div>
  );
}
