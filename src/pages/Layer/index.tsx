import styles from './index.less';

const Demo = () => {
  // useEffect(() => {
  //   const canvas = document.getElementsByTagName('canvas')[0];
  //   const ctx = canvas.getContext('2d');
  //   ctx.font = '16px serif';
  //   ctx.fillText('canvas', 10, 50);
  //   console.log(ctx);
  // }, []);
  return (
    <>
      <div className={styles.one}>1</div>
      <div className={styles.tow}>2</div>
      <div className={styles.three}>3</div>
    </>
  );
};

export default Demo;
