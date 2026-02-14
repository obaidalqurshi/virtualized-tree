import {useState} from 'react'
import treeData from './data/treeWithTime.json'
import { TreeCanvas } from './components/TreeCanvas'
import type { TreeNodeData } from './types/tree'
import { TimeSeriesModal } from './components/TimeSeriesModal'
import { AnimatePresence, motion } from 'motion/react'
export default function App(){
  const [selectedNode, setSelectedNode] = useState<TreeNodeData |null>(null);
  return(
    <>
    <TreeCanvas data={treeData} onSelectNode={setSelectedNode} />
    <AnimatePresence>
    {selectedNode &&(
      
      <TimeSeriesModal node={selectedNode} onClose={()=> setSelectedNode(null)} />
    )}


</AnimatePresence>
    </>
  )
}

