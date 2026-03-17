import * as d3 from "d3"
import type { TreeNodeData } from "../types/tree"
export function TreeLinks({
  links,
}: {
  links: d3.HierarchyLink<TreeNodeData>[]
}) {
  return (
    <g fill="none" strokeWidth={1.5}>
      {links.map((link) => {
        const sx = link.source.x;
        const sy = link.source.y;
        const tx = link.target.x;
        const ty = link.target.y;



        const midY = (sy + ty) / 2;
        const radius = 10;
        const secondLinkOffset = 4 
        const isBelow = tx > sx;
        const vDir = isBelow ? 1 : -1;

        const getPath = (ox = 0, oy = 0) => {
          const _sy = sy + oy;
          const _sx = sx + ox;
          const _ty = ty + oy;
          const _tx = tx + ox;
          const _midY = midY + oy;

          if (Math.abs(tx - sx) < 1) {
             return `M ${_sy},${_sx} L ${_ty},${_tx}`;
          }

          return `
            M ${_sy},${_sx}
            L ${_midY - radius},${_sx}
            Q ${_midY},${_sx} ${_midY},${_sx + radius * vDir}
            L ${_midY},${_tx - radius * vDir}
            Q ${_midY},${_tx} ${_midY + radius},${_tx}
            L ${_ty},${_tx}
          `;
        };

        return (
          <g key={`${link.source.id}-${link.target.id}`}>
            <path
              d={getPath(secondLinkOffset, -secondLinkOffset)}
              stroke="#cbd5e0"
              strokeDasharray="4 4"
            />
            <path 
              d={getPath(0, 0)} 
              stroke="#989da1" 
            />
          </g>
        );
      })}
    </g>
  );
}