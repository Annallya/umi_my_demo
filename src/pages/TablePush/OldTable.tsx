import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Table } from 'antd';
import G6, { Graph } from '@antv/g6';
import { NodeConfig, EdgeConfig } from '@antv/g6/lib/types';
import registerNode from './registerNode';
import registerEdge from './registerEdge';
import registerBehavior from './registerBehavior';
import { leftFieldData, rightFieldData } from './mock';
import styles from './index.less';

const renderTable = ({ columnsTitle, dataSource, rowClassName }) => {
  const columns = [
    {
      title: columnsTitle,
      dataIndex: 'fieldname',
      ellipsis: true,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldtype',
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowClassName={rowClassName}
      pagination={false}
      style={{ width: 248 }}
    />
  );
};

const OldTable = ({ setGraphInfo }: { setGraphInfo: any }) => {
  const containerRef = useRef(null);

  const [myGraph, setMyGraph] = useState<Graph | null>(null);

  const [model, setModel] = useState({ source: '', target: '', targetIsError: false });

  const getInitGraphData = useCallback(() => {
    const nodes: NodeConfig[] = [];
    leftFieldData.forEach((item, index) => {
      nodes.push({
        id: `${item.fieldname}&1`,
        x: 5,
        y: index * 56 + 28,
        fieldname: item.fieldname,
        fieldtype: item.fieldtype,
        position: 'left',
      });
    });
    rightFieldData.forEach((item, index) => {
      nodes.push({
        id: `${item.fieldname}&2`,
        x: 123,
        y: index * 56 + 28,
        fieldname: item.fieldname,
        fieldtype: item.fieldtype,
        position: 'right',
      });
    });
    const edges: EdgeConfig[] | any[] = leftFieldData
      .map((item, index) => {
        if (index > rightFieldData.length - 1) return null;
        return {
          source: `${item.fieldname}&1`,
          target: `${rightFieldData[index].fieldname}&2`,
        };
      })
      .filter(item => item);
    return { nodes, edges };
  }, [leftFieldData, rightFieldData]);

  const renderGraph = useCallback(
    graph => {
      graph.data(getInitGraphData());
      graph.render();
    },
    [myGraph],
  );

  useEffect(() => {
    // 自定义行为模式
    registerBehavior({ setGraphInfo, setModel });
    if (!myGraph) {
      const graph = new G6.Graph({
        container: containerRef.current || '',
        width: 128,
        height: Math.max(leftFieldData.length, rightFieldData.length) * 56,
        modes: {
          default: ['add-edge'],
        },
        defaultNode: {
          type: 'leaf-node', // 不能使用默认的
          size: 8,
          style: {
            fill: '#1980FF',
          },
        },
        nodeStateStyles: {
          notSelected: {
            r: 5, // 设置size无效
            fill: '#fff',
          },
        },
        defaultEdge: {
          type: 'edgeWithCloseIcon',
          style: {
            stroke: '#1980FF',
            lineWidth: 2,
            endArrow: {
              fill: '#1980FF',
              path: G6.Arrow.triangle(10, 10),
              stroke: 'rgba(0, 0, 0, 0)',
            },
            lineDash: [3, 5],
            lineAppendWidth: 10,
          },
        },
      });

      // 自定义边样式
      registerEdge(graph);
      registerNode(graph);

      renderGraph(graph);
      setMyGraph(graph);
    }
  }, [leftFieldData, rightFieldData]);

  const getRowClassName = record => {
    const targetRow = record.fieldname === model.source;
    return targetRow ? 'activeRow' : '';
  };

  const getRowClassName2 = record => {
    const isTargetRow = record.fieldname === model.target;
    const isErrorRow = isTargetRow && model.targetIsError;
    return isTargetRow ? (isErrorRow ? 'errorRow' : 'activeRow') : '';
  };

  return (
    <div className={styles.container1} style={{ border: '1px #ccc solid' }}>
      <div className={styles.left}>
        {renderTable({
          columnsTitle: '数据源字段名',
          dataSource: leftFieldData,
          rowClassName: getRowClassName,
        })}
      </div>
      <div className={styles.center}>
        <div className={styles.centerTopShow}>至少一条映射</div>
        <div
          className={styles.g6Canvas}
          ref={containerRef}
          style={{ height: Math.max(leftFieldData.length, rightFieldData.length) * 56 }}
        />
      </div>
      <div className={styles.ritgh}>
        {renderTable({
          columnsTitle: '存储源字段名',
          dataSource: rightFieldData,
          rowClassName: getRowClassName2,
        })}
      </div>
    </div>
  );
};

export default OldTable;
