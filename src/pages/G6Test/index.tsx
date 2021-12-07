import React, { useEffect, useRef } from 'react';
import G6 from '@antv/g6';

const nodes = [] as any;
const edges = [] as any;

const centerNode = {
  id: 'center',
  x: 500,
  y: 300,
  type: 'center-node', // !对应的是注册的节点名称
  size: 20,
};

nodes.push(centerNode);

// 添加左侧几个点
for (let i = 0; i < 4; i++) {
  const id = `left${i}`;
  nodes.push({
    id,
    x: 250,
    y: (i + 1) * 100 + 50,
    type: 'left-node',
  });
  edges.push({
    source: id,
    target: 'center',
    type: 'can-running',
  });
}

// 添加右边几个点
for (let i = 0; i < 4; i++) {
  const id = `right${i}`;
  nodes.push({
    id,
    x: 750,
    y: (i + 1) * 100 + 50,
    type: 'right-node',
  });
  edges.push({
    source: 'center',
    target: id,
    type: 'can-running',
  });
}

// 注册节点样式
G6.registerNode(
  'leaf-node',
  {
    afterDraw(cfg, group) {
      // 绘制后执行
      (group as any).addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: 10,
          fill: (cfg as any).color || '#5B8FF9',
        },
        name: 'circle-shape',
      });
    },
    getAnchorPoints() {
      // 获取锚点
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  },
  'circle',
);

// 注册中间节点样式
G6.registerNode(
  'center-node',
  {
    afterDraw(cfg: any, group: any) {
      const r = cfg.size / 2;
      group.addShape('circle', {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r: r + 10,
          fill: 'gray',
          opacity: 0.4,
        },
        name: 'circle-shape1',
      });
      group.addShape('circle', {
        zIndex: -2,
        attrs: {
          x: 0,
          y: 0,
          r: r + 20,
          fill: 'gray',
          opacity: 0.2,
        },
        name: 'circle-shape2',
      });
      group.sort();
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  },
  'circle',
);

// 虚线数组
const lineDash = [4, 2, 1, 2];

G6.registerEdge(
  'can-running',
  {
    setState(name, value, item) {
      console.log(name, value, item);
      const shape = item.get('keyShape');
      if (name === 'running') {
        if (value) {
          let index = 0;
          shape.animate(
            () => {
              index++;
              if (index > 9) {
                index = 0;
              }
              const res = {
                lineDash,
                lineDashOffset: -index,
              };
              // return the params for this frame
              return res;
            },
            {
              repeat: true,
              duration: 3000,
            },
          );
        } else {
          shape.stopAnimate();
          shape.attr('lineDash', null);
        }
      }
    },
  },
  'cubic-horizontal',
);

const G6Test = () => {
  const ref = useRef(null);

  useEffect(() => {
    const graph = new G6.Graph({
      container: ref.current,
      width: 1000,
      height: 800,
      defaultNode: {
        style: {
          fill: '#DEE9FF', // 节点的填充色
          stroke: '#5B8FF9', // 节点边的颜色
        },
      },
      defaultEdge: {
        style: {
          stroke: '#b5b5b5',
        },
      },
    });
    graph.data({ nodes, edges });
    graph.render();
    graph.fitView();

    // 设置hover的状态
    graph.on('node:mouseenter', ev => {
      const node: any = ev.item;
      const edgess = node.getEdges();
      edgess.forEach(edge => graph.setItemState(edge, 'running', true));
    });

    graph.on('node:mouseleave', ev => {
      const node: any = ev.item;
      const edgess = node.getEdges();
      edgess.forEach(edge => graph.setItemState(edge, 'running', false));
    });
  }, []);
  return <div id="container" ref={ref} />;
};

export default G6Test;
