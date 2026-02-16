export interface TimePoint {
    date: string
    value: number
  }
  
  export interface TreeNodeData {
    id: string
    name: string
    timeSeries: TimePoint[]
    children: TreeNodeData[]
  }
  
  export interface PositionedNode {
    id: string
    name: string
    x: number | undefined
    y: number | undefined
    depth: number
    parentId?: string
    data: TreeNodeData
  }
  