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
  return(
    <g transform={`translate(${node.y}, ${node.x})`} >
      <circle 
        r={6}
        fill={isExpanded ? 'green' : 'red'}
        onClick={(e)=>{
          e.stopPropagation()
          onToggle(node.id)
        }}
        cursor='pointer' />

        <rect 
        x={10}
        y={-12}
        width={120}
        height={24}
        rx={4}
        fill="lightblue"
        onClick={()=> onSelect(node.data)}
        />

        <text 
        x={16}
        y={4}
        fill="black"
        fontSize={10}
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