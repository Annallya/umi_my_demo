import { useState } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import styles from './index.less';

const array = new Array(100).fill('test');

const data = array.map((item, index) => {
  return {
    fieldName: `id_${index}`,
    fieldType: `string_${index}`,
  };
});

const Row = p => {
  const { index, style } = p;
  return (
    <div style={style}>
      <div style={{ display: 'flex' }}>
        <div className={styles.side}>
          <div className={styles.inner}>
            <span>{data[index].fieldName}</span>
            <span style={{ marginLeft: 12 }}>{data[index].fieldType}</span>
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.inner} />
        </div>
        <div className={styles.side}>
          <div className={styles.inner}>
            <span>{data[index].fieldName}</span>
            <span style={{ marginLeft: 12 }}>{data[index].fieldType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
const Demo = () => {
  /**
   * 每个列表项的组件
   * @param index：列表项的下标；style：列表项的样式（此参数必须传入列表项的组件中，否则会出现滚动到下方出现空白的情况）
   * */

  return (
    <AutoSizer>
      {({ height, width }) => {
        console.log('height', height);
        console.log('width', width);
        return (
          <FixedSizeList
            height={height} // 列表可视区域的高度
            itemCount={data.length} // 列表数据长度
            itemSize={48} // 设置列表项的高度
            layout="vertical" // （vertical/horizontal） 默认为vertical，此为设置列表的方向
            width={width}
          >
            {Row}
          </FixedSizeList>
        );
      }}
    </AutoSizer>
  );
};

export default Demo;
