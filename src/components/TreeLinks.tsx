import * as d3 from "d3"
import type { TreeNodeData } from "../types/tree"

export function TreeLinks({
  links,
}: {
  links: d3.HierarchyPointLink<TreeNodeData>[]
}) {
  return (
    <g fill="none" stroke="black" strokeWidth={1.5}>
      {links.map((link, i) => {
        const sx = link.source.x
        const sy = link.source.y
        const tx = link.target.x
        const ty = link.target.y

        const path = `
          M ${sx},${sy}
          L ${sx},${ty}
          L ${tx},${ty}
        `

        return <path key={i} d={path} />
      })}
    </g>
  )
}