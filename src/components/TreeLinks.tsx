import * as d3 from "d3"

export function TreeLinks({
  links,
}: {
  links: d3.HierarchyPointLink<any>[]
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