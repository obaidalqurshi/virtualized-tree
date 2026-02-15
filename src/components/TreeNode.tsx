import type { PositionedNode } from "../types/tree";

interface Props{
  node: PositionedNode,
  isExpanded: boolean,
  onToggle: (id: string) => void;
  onSelect: (data: PositionedNode["data"]) => void;
}

export function TreeNode({
  node,
  isExpanded,
  onToggle,
  onSelect
}: Props){

  const mainRadius = 24
  const toggleRadius = 10
  const gap = 6
  return(
    <g transform={`translate(${node.x}, ${node.y})`} >
      <circle 
        r={24}
        fill={isExpanded ? 'green' : 'red'}
        onClick={()=> {
          onSelect(node.data)
        }}
        cursor='pointer'/>
          
          {!!node.data.children?.length && (
        <g
          transform={`translate(0, ${mainRadius + gap + toggleRadius})`}
          cursor="pointer"
          onClick={() => onToggle(node.id)}
        >
          <circle
            r={toggleRadius}
            fill="#333"
          />

          <text
            x={0}
            y={0}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={14}
            fontWeight="bold"
            pointerEvents="none"
          >
            {isExpanded ? "−" : "+"}
          </text>
        </g>
      )}
  <text
    x={0}
    y={0}
    textAnchor="middle"
    dominantBaseline="middle"
    fill="white"
    fontSize={8}
    pointerEvents="none"
  >
    {node.name}
  </text>
        <title>
        {node.name}
        {"\n"}
        ID: {node.id}
        {"\n"}
      </title>


    </g>
  )
}