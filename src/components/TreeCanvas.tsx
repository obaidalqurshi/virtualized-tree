import * as d3 from "d3"
import { useEffect, useRef, useState } from "react"
import { useTreeLayout } from "../hooks/useTreeLayout"
import type { TreeNodeData } from "../types/tree"
import { TreeNode } from "./TreeNode"
import { TreeLinks } from "./TreeLinks"

interface Props {
  data: TreeNodeData
  onSelectNode: (node: TreeNodeData) => void
}

export function TreeCanvas({ data, onSelectNode }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const gRef = useRef<SVGGElement | null>(null)

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([data.id])
  )

  const { nodes, links } = useTreeLayout(data, {
    expandedIds,
    nodeSize: [40, 160]
  })

  // Zoom / pan
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 2])
      .on("zoom", (event) => {
        d3.select(gRef.current!)
          .attr("transform", event.transform.toString())
      })

    d3.select(svgRef.current).call(zoom)
  }, [])

  const toggleNode = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100vh"
      style={{ background: "gray" }}
    >
      <g ref={gRef}>
        <TreeLinks links={links} />
        {nodes.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            isExpanded={expandedIds.has(node.id)}
            onToggle={toggleNode}
            onSelect={onSelectNode}
          />
        ))}
      </g>
    </svg>
  )
}
