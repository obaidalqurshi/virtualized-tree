import { useVirtualizer } from "@tanstack/react-virtual";
import type { PositionedNode } from "../types/tree";

interface Params{
    nodes: PositionedNode[]
    viewportHeight:  number,
    transform: d3.ZoomTransform,
    rowHeight: number,
}

export function useVirtlizedTree({
    nodes,
    viewportHeight,
    transform,
    rowHeight,
}: Params){
    const virtualizer = useVirtualizer({
        count: nodes.length,
        estimateSize: ()=>rowHeight,
        overscan: 10,
        getScrollElement: ()=> document.body
    })

    const visibleTop = -transform.y /transform.k;
    const visibleBottom = visibleTop + viewportHeight / transform.k;

    return virtualizer
        .getVirtualItems()
        .map(v => nodes[v.index])
        .filter(node => 
            node.y >= visibleTop - rowHeight &&
            node.y <= visibleBottom + rowHeight
        )
}