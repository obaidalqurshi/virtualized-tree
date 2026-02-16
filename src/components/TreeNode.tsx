import { useEffect, useRef } from "react"
import type { PositionedNode } from "../types/tree"
import { Tooltip, Box, Typography } from "@mui/material"

interface Props {
  node: PositionedNode
  isExpanded: boolean
  onToggle: (id: string) => void
  onSelect: (data: PositionedNode["data"]) => void
}

export function TreeNode({
  node,
  isExpanded,
  onToggle,
  onSelect,
}: Props) {
  const gRef = useRef<SVGGElement | null>(null)

  const mainRadius = 24
  const toggleRadius = 10
  const gap = -4

  useEffect(() => {
    if (!gRef.current) return

    gRef.current.style.transition =
      "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)"

    gRef.current.style.transform =
      `translate(${node.x}px, ${node.y}px)`
  }, [node.x, node.y])

const history = (node.data.timeSeries || [])
const latestValue = history[history.length - 1]?.value ?? "N/A"

const tooltip = (
  <Box sx={{ p: 0.5 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#e04f20' }}>
      {node.name}
    </Typography>
    <Typography variant="h6" sx={{ color: 'white' }}>
      Value: {latestValue}
    </Typography>
    
    {history.length > 0 && (
      <Box>
        {history.map((pt, i) => (
          <Typography key={i} variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {pt.date}: <strong>{pt.value}</strong>
          </Typography>
        ))}
      </Box>
    )}
  </Box>
)
  return (
    <g ref={gRef}>
    <Tooltip 
      title={tooltip} 
      arrow 
      placement="left"

    >
      <g cursor="pointer" onClick={() => onSelect(node.data)}>
        <circle r={mainRadius} fill="#e04f20" stroke="black" strokeWidth={1.5} />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={8}
          pointerEvents="none"
        >
          {node.name}
        </text>
      </g>
    </Tooltip>

    {!!node.data.children?.length && (
      <g
        transform={`translate(0, ${mainRadius + gap + toggleRadius})`}
        cursor="pointer"
        onClick={() => {
          onToggle(node.id)
        }}
      >
        <circle r={toggleRadius} fill="#4592be" />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={15}
          pointerEvents="none"
        >
          {isExpanded ? "-" : "+"}
        </text>
      </g>
    )}
  </g>
  )
}
