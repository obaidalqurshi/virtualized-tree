import * as d3 from "d3"
import { useEffect, useRef, useState } from "react"
import { useTreeLayout } from "../hooks/useTreeLayout"
import type { TreeNodeData, PositionedNode } from "../types/tree"
import { TreeNode } from "./TreeNode"
import { TreeLinks } from "./TreeLinks"

interface Props {
  data: TreeNodeData
  onSelectNode: (node: TreeNodeData) => void
}

export function TreeCanvas({ data, onSelectNode }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const gRef = useRef<SVGGElement | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)

  const [, setTick] = useState(0)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([data.id])
  )

  // Vertical layout: nodeSize [x-separation between siblings, y-separation between levels]
  const { nodes, links } = useTreeLayout(data, {
    expandedIds,
    nodeSize: [160, 100],
  })

  useEffect(() => {
    if (
      !svgRef.current ||
      !zoomRef.current ||
      viewport.width === 0 ||
      viewport.height === 0 ||
      nodes.length === 0
    ) return

    const bounds = getSubtreeBounds(nodes, data.id)
    const target = fitBounds(bounds, viewport)

    d3.select(svgRef.current)
      .call(zoomRef.current.transform, target)

    transformRef.current = target
    setTick(t => t + 1)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport.width, viewport.height, nodes.length])

  useEffect(() => {
    if (!svgRef.current) return

    const update = () => {
      const rect = svgRef.current!.getBoundingClientRect()
      setViewport({ width: rect.width, height: rect.height })
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        transformRef.current = event.transform
        d3.select(gRef.current!).attr(
          "transform",
          event.transform.toString()
        )
        setTick(t => t + 1)
      })

    zoomRef.current = zoom
    d3.select(svgRef.current).call(zoom)
  }, [])

  const toggleNode = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      const isExpanding = !next.has(id)

      if (isExpanding) {
        next.add(id)
      } else {
        next.delete(id)
      }

      requestAnimationFrame(() => {
        if (!svgRef.current || !zoomRef.current) return

        if (isExpanding) {
          const bounds = getSubtreeBounds(nodes, id)
          const target = fitBounds(bounds, viewport)

          d3.select(svgRef.current)
            .transition()
            .duration(600)
            .ease(d3.easeCubicOut)
            .call(zoomRef.current!.transform, target)

          transformRef.current = target
        }

        setTick(t => t + 1)
      })

      return next
    })
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100vh"
      style={{ background: "#2b2b2b" }}
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


function getSubtreeBounds(nodes: PositionedNode[], rootId: string) {
  const subtree = nodes.filter(
    n => n.id === rootId || n.parentId === rootId
  )

  // Vertical layout: node.x is horizontal position, node.y is vertical (depth) position
  const xs = subtree.map(n => n.x)
  const ys = subtree.map(n => n.y)

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

function fitBounds(
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  viewport: { width: number; height: number },
  padding = 100
) {
  // Vertical layout: width spans the horizontal axis (X), height spans vertical axis (Y)
  const w = bounds.maxX - bounds.minX
  const h = bounds.maxY - bounds.minY

  const scale = Math.min(
    viewport.width / (w + padding),
    viewport.height / (h + padding),
    1.5
  )

  const x = viewport.width / 2 - scale * ((bounds.minX + bounds.maxX) / 2)
  const y = viewport.height / 2 - scale * ((bounds.minY + bounds.maxY) / 2)

  return d3.zoomIdentity.translate(x, y).scale(scale)
}