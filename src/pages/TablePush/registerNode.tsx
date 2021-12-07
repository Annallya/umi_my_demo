import G6 from '@antv/g6';

// 注册节点样式

export default function registerNode(graph) {
  G6.registerNode(
    'leaf-node',
    {
      afterDraw(cfg, group) {
        // 绘制后执行
        (group as any).addShape('circle', {
          attrs: {
            x: 0,
            y: 0,
            r: 4,
            cursor: 'pointer',
          },
          name: 'custom',
        });
      },

      setState(name, value, item) {
        const shape: any = item?.getContainer();
        const node = shape?.find(element => element.get('name') === 'custom');
        if (name === 'notSelected' && value) {
          node.attr('opacity', 1);
          node.attr('fill', '#fff');
          node.attr('r', 5);
          node.attr('stroke', '#1980FF');
          graph.get('canvas').draw();
        } else {
          node.attr('opacity', 0);
        }
      },
    },
    'circle',
  );
}
