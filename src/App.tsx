import {useState} from 'react'
import { TreeCanvas } from './components/TreeCanvas'
import type { TreeNodeData } from './types/tree'
import { TimeSeriesModal } from './components/TimeSeriesModal'
import { useTreeStore } from './store/useTreeStore'

export default function App(){
  const [selectedNode, setSelectedNode] = useState<TreeNodeData |null>(null);
  const data = useTreeStore((state) => state.data);

  return(
    <>
    <TreeCanvas data={data} onSelectNode={setSelectedNode} />

    {selectedNode &&(
      <TimeSeriesModal node={selectedNode} onClose={()=> setSelectedNode(null)} />
    )}
    </>
  )
}

