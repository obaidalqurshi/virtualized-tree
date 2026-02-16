import * as d3 from "d3"
import { useEffect, useRef, useState } from "react"
import { useTreeLayout } from "../hooks/useTreeLayout"
import type { TreeNodeData } from "../types/tree"
import { TreeNode } from "./TreeNode"
import { TreeLinks } from "./TreeLinks"
import { Button } from "@mui/material"


interface Props {
  data: TreeNodeData
  onSelectNode: (node: TreeNodeData) => void
}

export function TreeCanvas({ data, onSelectNode }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const gRef = useRef<SVGGElement | null>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const treeCentered = useRef(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([data.id])
  )

  const { nodes, links } = useTreeLayout(data, {
    expandedIds,
    nodeSize: [160, 100],
  })

  const collapseAll = () => {
    setExpandedIds(new Set([data.id]))
  }

  useEffect(() => {
    if (!svgRef.current ) return
    const update = ()=>{
      const rect = svgRef.current!.getBoundingClientRect()
      setViewport({ width: rect.width, height: rect.height})
    }
    update();
    window.addEventListener('resize', update)
    return ()=> window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !gRef.current || nodes.length === 0) return
    if(treeCentered.current) return; 
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        d3.select(gRef.current!).attr(
          "transform",
          event.transform
        )

      })

    zoomRef.current = zoom
    d3.select(svgRef.current).call(zoom)

    const svgWidth = viewport.width || svgRef.current.clientWidth
    const svgHeight = viewport.height || svgRef.current.clientHeight

    const rootNode = nodes.find(n => n.id === data.id)
    if (!rootNode) return

    const initialTransform = d3.zoomIdentity
      .translate(svgWidth / 2 , svgHeight / 2 )
      .scale(1)

    d3.select(svgRef.current)
      .call(zoom.transform, initialTransform)

    treeCentered.current = true;
  }, [nodes, viewport.width, viewport.height, data.id])

  const toggleNode = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      const isExpanding = !next.has(id)

      if (isExpanding) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
<div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)', 
          zIndex: 10,
          display: 'flex',
          gap: '10px' 
        }}
      >
        <Button
          variant="contained"
          onClick={collapseAll}
          sx={{
            backgroundColor: '#e04f20',
            '&:hover': { backgroundColor: '#c6441b' },
            textTransform: 'none',
            borderRadius: '20px',
            px: 3,
          }}
        >
          Collapse all
        </Button>
      </div>
    <svg
      ref={svgRef}
      width="100%"
      height="100vh"
      style={{ background: "#1b1b1f" }}
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
    </div>
  )
}