import React from 'react';
import styles from './index.css';

export default function(props) {
  return (
    <div className={styles.normal}>
      <ul className={styles.list}>
        <li>
          {props} <code>src/pages/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">Getting Started</a>
        </li>
      </ul>
    </div>
  );
}
