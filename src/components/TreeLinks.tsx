import * as d3 from "d3"

export function TreeLinks({ links }: { links: d3.HierarchyPointLink<any>[] }) {
  const path = d3.linkHorizontal<any, any>()
    .x(d => d.y)
    .y(d => d.x)

  return (
    <g fill="none" stroke="#334155" strokeWidth={1.5}>
      {links.map((link, i) => (
        <path key={i} d={path(link) || ""} />
      ))}
    </g>
  )
}
