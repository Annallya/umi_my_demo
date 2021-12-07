import React, { useRef, useEffect } from 'react';
import G6 from '@antv/g6';
import { data, registerBehavior } from './register';

const TestConnect = () => {
  const ref = useRef(null);

  useEffect(() => {
    registerBehavior();
    const graph = new G6.Graph({
      container: ref.current,
      width: 200,
      height: 300,
      modes: {
        // 定义的 Behavior 指定到这里，就可以支持 Behavior 中定义的交互
        default: ['click-add-edge'],
      },
      defaultNode: {
        style: {
          fill: '#DEE9FF', // 节点的填充色
          stroke: '#5B8FF9', // 节点边的颜色
        },
      },
      defaultEdge: {
        // type: 'edgeWithCloseIcon',
        // sourceAnchor: 1,
        // targetAnchor: 0,
        style: {
          endArrow: {
            path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
            fill: '#ccc',
          },
          stroke: '#ccc',
          lineAppendWidth: 10,
        },
      },
    });
    graph.data(data);
    graph.render();
    graph.fitView();
  }, []);
  return <div id="container" ref={ref} />;
};
export default TestConnect;
