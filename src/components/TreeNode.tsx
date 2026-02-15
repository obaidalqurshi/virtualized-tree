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
    <g transform={`translate(${node.x}, ${node.y})`} >
      <circle 
        r={24}
        fill={isExpanded ? 'green' : 'red'}
        onClick={()=> {
          onSelect(node.data)
        }}
        cursor='pointer'/>
          
        {!!node.data.children?.length &&(
                  <text 
                  x={0}
                  y={24}
                  fill="white"
                  fontSize={15}
                  cursor='pointer'
                  onClick={()=>{
                    onToggle(node.id)
                  }}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  >
                     {isExpanded ? "-" : "+"}

                  </text>
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