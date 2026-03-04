import { create } from 'zustand';
import type {TreeNodeData} from '../types/tree'
import initialTreeData from '../data/treeWithTime.json'

interface TreeState {
  data: TreeNodeData;
  addChild: (parentId: string, newChild: TreeNodeData) => void;
  deleteNode: (id: string) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  data: initialTreeData,

  addChild: (parentId, newChild) =>
    set((state) => {
      const updateRecursive = (node: TreeNodeData): TreeNodeData => {
        if (node.id === parentId) {
          return { ...node, children: [...(node.children || []), newChild] };
        }
        return {
          ...node,
          children: node.children?.map(updateRecursive) || [],
        };
      };
      return { data: updateRecursive(state.data) };
    }),

  deleteNode: (id) =>
    set((state) => {
      const removeRecursive = (node: TreeNodeData): TreeNodeData => ({
        ...node,
        children: node.children
          ?.filter((child) => child.id !== id)
          .map(removeRecursive) || [],
      });
      return { data: removeRecursive(state.data) };
    }),
}));