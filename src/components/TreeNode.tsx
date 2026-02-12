import type { PositionedNode } from "../types/tree"

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
  onSelect
}: Props) {
  return (
    <g transform={`translate(${node.y},${node.x})`}>
      {/* Expand / collapse */}
      <circle
        r={6}
        fill={isExpanded ? "#4ade80" : "#f87171"}
        onClick={(e) => {
          e.stopPropagation()
          onToggle(node.id)
        }}
        cursor="pointer"
      />

      <rect
        x={10}
        y={-12}
        width={120}
        height={24}
        rx={4}
        fill="#1e293b"
        onClick={() => onSelect(node.data)}
      />

      <text
        x={16}
        y={4}
        fill="#e5e7eb"
        fontSize={12}
      >
        {node.name}
      </text>
    </g>
  )
}
