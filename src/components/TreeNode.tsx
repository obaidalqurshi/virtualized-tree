import { useEffect, useRef } from "react"
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
  onSelect,
}: Props) {
  const gRef = useRef<SVGGElement | null>(null)

  const mainRadius = 24
  const toggleRadius = 10
  const gap = -4

  useEffect(() => {
    if (!gRef.current) return

    gRef.current.style.transition =
      "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)"

    gRef.current.style.transform =
      `translate(${node.x}px, ${node.y}px)`
  }, [node.x, node.y])

  return (
    <g ref={gRef}>
      <circle
        r={mainRadius}
        fill="#e04f20"
        stroke="black"
        strokeWidth={1.5}
        cursor="pointer"
        onClick={() => onSelect(node.data)}
      />

      {!!node.data.children?.length && (
        <g
          transform={`translate(0, ${mainRadius + gap + toggleRadius})`}
          cursor="pointer"
          onClick={() => {
            onToggle(node.id)
          }}
        >
          <circle r={toggleRadius} fill="#333" />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={15}
            pointerEvents="none"
          >
            {isExpanded ? "−" : "+"}
          </text>
        </g>
      )}
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
  )
}
