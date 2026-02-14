import { TreeNodeData } from "../types/tree";
import { TimeSeriesChart } from "./TimeSeriesChart";


export function TimeSeriesModal({
  node, 
  onClose
}:{
  node: TreeNodeData
  onClose: ()=>void
}){
  return(
    <div 
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: 500,
        height: "100%",
        background: 'white',
        padding: 16,
      }}>

      <button onClick={onClose}>close</button>
      <h3>{node.name}</h3>
      <TimeSeriesChart data={node.timeSeries} />

      </div>
  )
}