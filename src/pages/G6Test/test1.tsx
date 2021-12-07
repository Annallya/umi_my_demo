import React from 'react';
import G6, { Graph } from '@antv/g6';

// 注册节点样式
G6.registerNode(
  'leaf-node',
  {
    // 绘制后执行
    afterDraw(cfg, group: any) {
      group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: 5,
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

// 自定义行为
G6.registerBehavior('active-node', {
  getDefaultCfg() {
    return {
      multiple: true,
    };
  },
  getEvents() {
    return {
      'node:click': 'onNodeClick',
      'canvas:click': 'onCanvasClick',
    };
  },

  onNodeClick(e) {
    const { graph } = this;
    const { item } = e;
    console.log(item);
    if (item.hasState('active')) {
      graph.setItemState(item, 'active', false);
    }

    if (!this.multiple) {
      this.removeNodesState();
    }

    graph.setItemState(item, 'active', true);
  },

  onCanvasClick(e) {
    // shouldUpdate 可以由用户复写，返回 true 时取消所有节点的 'active' 状态，即将 'active' 状态置为 false
    if (this.shouldUpdate(e)) {
      this.removeNodesState();
    }
  },

  removeNodesState() {
    const { graph } = this;
    graph.findAllByState('node', 'active').forEach(node => {
      graph.setItemState(node, 'active', false);
    });
  },
});

const nodes = [
  {
    id: 'node1',
    x: 50,
    y: 50,
    type: 'leaf-node', // !对应的是注册的节点名称
    size: 10,
  },
  {
    id: 'node2',
    x: 60,
    y: 50,
    type: 'leaf-node', // !对应的是注册的节点名称
    size: 10,
  },
  {
    id: 'node3',
    x: 90,
    y: 60,
    type: 'leaf-node', // !对应的是注册的节点名称
    size: 10,
  },
  {
    id: 'node4',
    x: 50,
    y: 90,
    type: 'leaf-node', // !对应的是注册的节点名称
    size: 10,
  },
];

const edges = [
  {
    source: 'node1',
    target: 'node2',
  },
  {
    source: 'node3',
    target: 'node4',
  },
];

const Test1 = () => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const graph = new G6.Graph({
      container: ref.current,
      width: 300,
      height: 600,
      modes: {
        default: ['active-node'],
      },
      //   defaultNode: {
      //     style: {
      //       fill: '#DEE9FF', // 节点的填充色
      //       stroke: '#5B8FF9', // 节点边的颜色
      //     },
      //   },
      //   defaultEdge: {
      //     style: {
      //       stroke: '#b5b5b5',
      //     },
      //   },
    });
    graph.data({ nodes, edges });
    graph.render();
    graph.fitView();
  }, []);
  return <div id="container" ref={ref} />;
};

export default Test1;
