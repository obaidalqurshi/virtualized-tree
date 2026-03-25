import * as d3 from "d3";
import { useMemo } from "react";
import type { TreeNodeData, PositionedNode } from "../types/tree";

export function useTreeLayout(data: TreeNodeData, expandedIds: Set<string>) {
  return useMemo(() => {
    const root = d3.hierarchy<TreeNodeData>(data, (d) => {
      return expandedIds.has(d.id) ? d.children : null;
    });

    const treeLayout = d3.tree<TreeNodeData>().nodeSize([95, 125]);
    treeLayout(root);

// Applying offset to the nodes to make the first child appear in the same line as its parent
    root.each((node) => {
      if (node.children && node.children.length > 0) {
        const firstChild = node.children[0];
        const offset = node.x - firstChild.x;

        node.children.forEach((child) => {
          child.each((descendant) => {
            descendant.x += offset;
          });
        });
      }
    });

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
  }, [data, expandedIds]);
}