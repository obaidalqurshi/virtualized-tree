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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([data.id])
  )

  const { nodes, links } = useTreeLayout(data, {
    expandedIds,
    nodeSize: [160, 100],
  })

  useEffect(() => {
    if (!svgRef.current || !gRef.current || nodes.length === 0) return
  
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        d3.select(gRef.current!).attr("transform", event.transform)
      })
  
    const svg = d3.select(svgRef.current);
    svg.call(zoom);
  
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
  
  
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2) 
      .scale(1);
  
  
    svg.call(zoom.transform, initialTransform);
  
  }, [nodes.length]);


  useEffect(() => {
    if (!svgRef.current || !gRef.current || nodes.length === 0) return
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        d3.select(gRef.current!).attr(
          "transform",
          event.transform
        )

      })

    d3.select(svgRef.current).call(zoom)

  }, [nodes, data.id])

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
    <div >
<div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)', 
          display: 'flex',
        }}
      >
        <Button
          variant="contained"
          onClick={()=>setExpandedIds(new Set([data.id]))}
          sx={{
            backgroundColor: '#e04f20',
            borderRadius: '20px',
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
      <g ref={gRef} >
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