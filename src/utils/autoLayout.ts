import dagre from "dagre";
import type { Node, Edge } from "reactflow";

export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = "LR") {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 200, height: 80 }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const pos = dagreGraph.node(node.id);
    node.position = {
      x: pos.x - 100,
      y: pos.y - 40,
    };
  });

  return { nodes, edges };
}
