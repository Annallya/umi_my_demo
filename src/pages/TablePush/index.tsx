import React, { useState } from 'react';
import { Modal } from 'antd';
import OldTable from './OldTable';
import styles from './index.less';

const TestLine = () => {
  const [graphInfo, setGraphInfo] = useState<any>({});
  let timer: any = null;
  // 鼠标弹起，删除边（需要写在最外层）
  const handleMouseUp = () => {
    if (Object.keys(graphInfo).length === 0) return;
    (graphInfo.graph as any).removeItem(graphInfo.edge);
    graphInfo.edge = null;
    graphInfo.addingEdge = false;
    setGraphInfo({});
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  // 鼠标移动，动态调整表格区域滚动条
  const handleMouseMove = e => {
    const el = document.querySelectorAll('.center')[0];
    const parentEl = document.querySelectorAll('.container1')[0];

    const { left, right } = el?.getBoundingClientRect();
    const { top, bottom } = parentEl?.getBoundingClientRect();
    const isValidX = e.clientX > left && e.clientX < right;
    const isAdd = Object.keys(graphInfo).length !== 0;

    // 鼠标在指定区域内执行
    if (isAdd && isValidX && e.clientY > bottom && !timer) {
      timer = setInterval(() => {
        parentEl.scrollTop += 1;
      }, 10);
    } else if (isAdd && isValidX && e.clientY < top && !timer) {
      timer = setInterval(() => {
        parentEl.scrollTop -= 1;
      }, 10);
    } else if (isAdd && isValidX && e.clientY < bottom) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    } else if (!isAdd) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  };
  return (
    <div onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <Modal title="测试" visible wrapClassName={styles.testModal}>
        <OldTable setGraphInfo={setGraphInfo} />
      </Modal>
    </div>
  );
};

export default TestLine;
