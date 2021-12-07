import G6 from '@antv/g6';
import { ModelConfig } from '@antv/g6/lib/types';
import delIcon from '../../assets/close-circle.png';
import { updateSelectedNodes } from './registerBehavior';

const errorColor = '#EA1E1E';
const primaryColor = '#1980FF';

function highlightEdge(edgeShape) {
  edgeShape.attr('stroke', `${errorColor}`);
  edgeShape.attr('endArrow', {
    path: G6.Arrow.triangle(6, 6),
    fill: `${errorColor}`,
  });
}

function lowlightEdge(graph, edgeShape) {
  edgeShape.attr('stroke', `${primaryColor}`);
  edgeShape.attr('endArrow', {
    path: G6.Arrow.triangle(6, 6),
    fill: `${primaryColor}`,
  });
  //   const edges = graph.getEdges();
  //   // 遍历边，将所有边的层级放置在后方，以恢复原样
  //   edges.forEach(edge => {
  //     edge.toBack();
  //   });
  //   // 注意：必须调用以根据新的层级顺序重绘
  //   graph.paint();
  //   graph.get('canvas').draw();
}

export default function registerEdge(graph) {
  G6.registerEdge(
    'edgeWithCloseIcon',
    {
      afterDraw(cfg: ModelConfig | undefined, group: any) {
        const { startPoint, endPoint } = cfg as any;

        group.addShape('circle', {
          attrs: {
            r: 10,
            opacity: 0,
            x: startPoint?.x + (endPoint?.x - startPoint?.x) / 2,
            y: startPoint.y + (endPoint.y - startPoint.y) / 2,
            stroke: '#EA1E1E',
            fill: '#fff',
            cursor: 'pointer',
          },
          name: 'delete-icon',
        });
        group.addShape('image', {
          attrs: {
            height: 20,
            width: 20,
            x: startPoint.x + (endPoint.x - startPoint.x) / 2 - 10,
            y: startPoint.y + (endPoint.y - startPoint.y) / 2 - 10,
            opacity: 0,
            cursor: 'pointer',
            img: delIcon,
          },
          name: 'delete-icon-svg',
        });
        // group.addShape('triangle', {
        //   attrs: {
        //     // height: 50,
        //     // width: 50,
        //     x: startPoint.x + (endPoint.x - startPoint.x) / 2 - 10,
        //     y: 100,
        //     opacity: 1,
        //     cursor: 'pointer',
        //   },
        //   name: 'arrow111',
        // });

        // 交互
        const edge: any = group?.find(element => {
          return element.get('name') === 'edge-shape';
        });
        const icon: any = group?.find(element => element.get('name') === 'delete-icon');
        const iconsvg: any = group?.find(element => element.get('name') === 'delete-icon-svg');

        const children = group.get('children');

        children.forEach(item => {
          item.on('mouseenter', () => {
            icon.attr('opacity', 1);
            iconsvg.attr('opacity', 1);
            highlightEdge(edge);
          });
          item.on('mouseleave', () => {
            icon.attr('opacity', 0);
            iconsvg.attr('opacity', 0);
            lowlightEdge(graph, edge);
          });
        });

        const icons = [icon, iconsvg];
        icons.forEach(item => {
          item.on('click', () => {
            // @ts-ignore
            graph.removeItem(cfg?.id);
            // !删除边时更新节点样式
            const sourceAndTarget: any = [cfg?.source, cfg?.target];
            updateSelectedNodes({ sourceAndTarget, graph, isNotSelected: true });
          });
        });
      },
      afterUpdate(cfg, item) {
        // @ts-ignore
        const { startPoint, endPoint } = cfg;
        const group = item?.getContainer();
        const icon: any = group?.find(element => element.get('name') === 'delete-icon');
        const iconsvg: any = group?.find(element => element.get('name') === 'delete-icon-svg');
        const edge: any = group?.find(element => {
          return element.get('name') === 'edge-shape';
        });
        if (edge) {
          lowlightEdge(graph, edge);
        }
        icon.attr({
          x: startPoint.x + (endPoint.x - startPoint.x) / 2,
          y: startPoint.y + (endPoint.y - startPoint.y) / 2,
          opacity: 0,
        });
        iconsvg.attr({
          x: startPoint.x + (endPoint.x - startPoint.x) / 2 - 10,
          y: startPoint.y + (endPoint.y - startPoint.y) / 2 - 10,
          opacity: 0,
        });
      },
    },
    'line',
  );
}
