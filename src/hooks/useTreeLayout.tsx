import * as d3 from "d3";
import { useMemo } from "react";
import type { TreeNodeData, PositionedNode } from "../types/tree";

interface Options {
  expandedIds: Set<string>;
  nodeSize: [number, number];
}

export function useTreeLayout(
  data: TreeNodeData,
  { expandedIds, nodeSize }: Options
) {
  return useMemo(() => {
    const root = d3.hierarchy<TreeNodeData>(data, (d) => {
      return expandedIds.has(d.id) ? d.children : null;
    });
    const treeLayout = d3.tree<TreeNodeData>().nodeSize(nodeSize);
    treeLayout(root);

    const nodes: PositionedNode[] = [];
    root.each((node) => {
      nodes.push({
        id: node.data.id,
        name: node.data.name,
        x: node.x,
        y: node.y,
        depth: node.depth,
        parentId: node.parent?.data.id,
        data: node.data,
      });
    });

    return {
      nodes,
      links: root.links(),
    };
  }, [data, expandedIds, nodeSize]);
}
