import { useState } from "react"
import treeData from "./data/treeWithTime.json"
import { TreeCanvas } from "./components/TreeCanvas"
import { TimeSeriesModal } from "./components/TimeSeriesModal"
import type { TreeNodeData } from "./types/tree"

export default function App() {
  const [selectedNode, setSelectedNode] = useState<TreeNodeData | null>(null)

  return (
    <>
      <TreeCanvas
        data={treeData}
        onSelectNode={setSelectedNode}
      />

      {selectedNode && (
        <TimeSeriesModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </>
  )
}
