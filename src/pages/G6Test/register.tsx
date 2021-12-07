import G6 from '@antv/g6';

const data = {
  nodes: [
    {
      id: 'node1',
      x: 100,
      y: 200,
    },
    {
      id: 'node2',
      x: 300,
      y: 200,
    },
    {
      id: 'node3',
      x: 300,
      y: 300,
    },
  ],
  edges: [
    {
      id: 'edge1',
      target: 'node2',
      source: 'node1',
    },
  ],
};

const registerBehavior = () => {
  G6.registerBehavior('click-add-edge', {
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
      const node = ev.item;
      const $graph = self.graph;
      const model = node.getModel() || {};
      self.edge = $graph.addItem('edge', {
        source: model.id,
        target: model.id,
      });
      $graph.updateItem(self.edge, {
        style: {
          stroke: '#000',
        },
      });
      self.addingEdge = true;
    },
    onMousemove(ev) {
      const self = this;
      const $graph = self.graph;
      const myEdge = self.edge;
      const point = { x: ev.x, y: ev.y };
      if (self.addingEdge && self.edge) {
        // Update the end node to the current node the mouse clicks
        $graph.updateItem(myEdge, {
          target: point,
        });
      }
    },
    onAddAdge(ev) {
      const self = this;
      if (self.addingEdge) {
        const currentEdge = ev.item;
        const node = ev.item;
        const $graph = self.graph;
        const myEdge = self.edge;
        const model = node?.getModel() || {};
        const edgeModel = myEdge?.getModel() || {};
        const currentEdgeModel = currentEdge?.getModel() || {};

        $graph.updateItem(myEdge, { target: model.id });
        self.edge = null;
        self.addingEdge = false;
      }
    },
    onMouseUp(ev) {
      const self = this;
      const currentEdge = ev.item;
      if (self.addingEdge && self.edge === currentEdge) {
        console.log('连接冲了');
        self.graph.removeItem(self.edge);
        self.edge = null;
        self.addingEdge = false;
      }
    },
  });
};

export { data, registerBehavior };
