import G6, { Graph as GraphType } from '@antv/g6';

function removeEdge(self) {
  self.graph.removeItem(self.edge);
  self.edge = null;
  self.addingEdge = false;
}

// 更新节点样式
export function updateSelectedNodes({
  sourceAndTarget,
  graph,
  isNotSelected,
}: {
  sourceAndTarget: string[];
  graph: GraphType;
  isNotSelected: boolean;
}) {
  const allNodes = graph.getNodes();
  sourceAndTarget.forEach(item => {
    const targetNodes = allNodes.find(_node => _node.getModel().id === item);
    if (!targetNodes) return;
    graph.setItemState(targetNodes, 'notSelected', isNotSelected);
  });
}

export default function registerBehavior(actions) {
  const { setGraphInfo, setModel } = actions;
  G6.registerBehavior('add-edge', {
    getEvents() {
      return {
        'node:mousedown': 'onMousedown',
        mousemove: 'onMousemove',
        'node:mouseup': 'onAddAdge',
        mouseup: 'onMouseUp',
      };
    },

    onMousedown(ev) {
      const self = this;
      if (ev.x > 120) {
        self.edge = null;
        self.addingEdge = false;
        return;
      }
      const node = ev.item;
      const $graph: any = self.graph;
      const allEdges = $graph.getEdges();
      const allEdgesNode = Array.from(
        new Set(
          allEdges.reduce((acc, cur) => {
            acc.push(cur.getModel().source);
            acc.push(cur.getModel().target);
            return acc;
          }, []),
        ),
      );

      const model = node?.getModel() || {};
      if (allEdgesNode.includes(model.id)) {
        self.edge = null;
        self.addingEdge = false;
      } else {
        if (setModel) {
          setModel(prevState => ({ ...prevState, source: model.fieldname }));
        }
        self.edge = $graph.addItem('edge', {
          source: model.id,
          target: model.id,
          style: {
            // TODO 调整箭头的大小
            lineWidth: 2,
            lineDash: [5, 10], // 虚线
          },
        });
        self.addingEdge = true;
        setGraphInfo(self);
      }
    },

    onMousemove(ev) {
      const self = this;
      const $graph: any = self.graph;
      const point = { x: ev.x, y: ev.y };

      if (self.addingEdge && self.edge) {
        const allEdges = $graph.getEdges();
        const rightCoords = allEdges
          .map(edge => {
            const model = edge?.getModel() || {};
            if (typeof model.target === 'string') {
              return model.endPoint;
            }
            return null;
          })
          .filter(_i => _i);
        // 范围 正负 10
        const isExsit = rightCoords.some(({ x, y }) => {
          if (x - 10 <= point.x && point.x <= x + 10 && y - 5 <= point.y && point.y <= y + 5)
            return true;
          return false;
        });

        if (!setModel) return;

        // *正常选中
        const allNodes = $graph.getNodes();
        // 返回所有右侧的表
        const rightNodes = allNodes
          .map(item => {
            if (item.getModel().position === 'right') return item.getModel();
            return null;
          })
          .filter(item => item);

        const targetRightModel = rightNodes.find(({ x, y }) => {
          return x - 10 <= point.x && point.x <= x + 10 && y - 5 <= point.y && point.y <= y + 5;
        });

        if (targetRightModel && !isExsit) {
          setModel(prevState => ({ ...prevState, target: targetRightModel.fieldname }));
        } else if (targetRightModel && isExsit) {
          setModel(prevState => ({
            ...prevState,
            target: targetRightModel?.fieldname,
            targetIsError: true,
          }));
        } else {
          setModel(prevState => ({ ...prevState, target: '', targetIsError: false }));
        }

        $graph.updateItem(self.edge, {
          target: point,
        });
      }
    },

    onAddAdge(ev) {
      const self = this;
      if (self.addingEdge) {
        const $graph: any = self.graph;
        const node = ev.item;
        const model = node?.getModel() || {};
        const myEdge: any = self.edge;
        const edgeModel = myEdge?.getModel() || {};
        const currentEdge = ev.item;
        const currentEdgeModel = currentEdge?.getModel() || {};

        const allEdges = $graph.getEdges();

        const allEdgesNode = Array.from(
          new Set(
            allEdges.reduce((acc, cur) => {
              acc.push(cur.getModel().source);
              acc.push(cur.getModel().target);
              return acc;
            }, []),
          ),
        ).filter(item => typeof item === 'string');

        let isSelf = false; // 是否连自己
        let isExist = false; // 是否已有连线
        if (edgeModel.source === currentEdgeModel.id) {
          isSelf = true;
        }
        if (allEdgesNode.includes(model.id)) {
          isExist = true;
        }
        if (isSelf || isExist) {
          removeEdge(self);
          return;
        }

        $graph.updateItem(myEdge, {
          target: model.id,
          style: {
            lineDash: [], // 虚线
          },
        });
        // !添加边更新节点样式
        const sourceAndTarget = [edgeModel.source, edgeModel.target];
        updateSelectedNodes({ sourceAndTarget, graph: $graph, isNotSelected: false });

        self.edge = null;
        self.addingEdge = false;
      }
    },

    onMouseUp(ev) {
      const self = this;
      const currentEdge = ev.item;

      if (setModel) {
        setModel({ source: '', target: '', targetIsError: false });
      }

      if (
        (self.addingEdge && self.edge === currentEdge) ||
        (self.addingEdge && currentEdge && currentEdge.getType() === 'edge')
      ) {
        removeEdge(self);
      }
    },
  });
}
