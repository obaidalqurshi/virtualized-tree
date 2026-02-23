import * as d3 from "d3"
import type { TreeNodeData } from "../types/tree"

export function TreeLinks({
  links,
}: {
  links: d3.HierarchyLink<TreeNodeData>[]
}) {
  return (
    
    <g fill="none" strokeWidth={1.5}>
      {links.map((link, i) => {
        const sx = link.source.x
        const sy = link.source.y
        const tx = link.target.x
        const ty = link.target.y

        const stroke = link.target.data.timeSeries[link.target.data.timeSeries.length - 1].value > 50 || link.source.data.timeSeries[link.source.data.timeSeries.length - 1].value > 50 ? "red" : "blue"


        const path = `
          M ${sx},${sy}
          L ${sx},${ty}
          L ${tx},${ty}
        `

        return <path key={i} d={path} stroke={stroke} />
      })}
    </g>
  )
}