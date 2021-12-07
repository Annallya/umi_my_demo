import React from 'react';
import styles from './index.css';

const BasicLayout: React.FC = props => {
  // console.log(props.location); // 可根据此来设定不一样的布局
  return <div className={styles.normal}>{props.children}</div>;
};

export default BasicLayout;
