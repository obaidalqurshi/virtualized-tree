import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { useTreeLayout } from "../hooks/useTreeLayout";
import type { TreeNodeData } from "../types/tree";
import { TreeNode } from "./TreeNode";
import { TreeLinks } from "./TreeLinks";
import { Button } from "@mui/material";

interface Props {
  data: TreeNodeData;
  onSelectNode: (node: TreeNodeData) => void;
}

export function TreeCanvas({ data, onSelectNode }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const pendingZoomNodeId = useRef<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([data.id])
  );

  const { nodes, links } = useTreeLayout(data, expandedIds);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        d3.select(gRef.current!).attr("transform", event.transform);
      });

    zoomRef.current = zoom;
    const svg = d3.select(svgRef.current);
    svg.call(zoom);

    const { width, height } = svgRef.current.getBoundingClientRect();

    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1);

    svg.call(zoom.transform, initialTransform);
   }, []);

  function zoomToNode(node: { x: number; y: number }) {
    if (!zoomRef.current || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = svgRef.current.getBoundingClientRect();
    const tx = width / 2 - node.y;
    const ty = height / 2 - node.x;

    const transform = d3.zoomIdentity
      .translate(tx, ty)

    svg
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .call(zoomRef.current.transform, transform);
  }

  const toggleNode = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
        pendingZoomNodeId.current = id;
      } else {
        next.add(id);
      }

      return next;
    });
  };

  useEffect(() => {
    if (!pendingZoomNodeId.current) return;

    const node = nodes.find((n) => n.id === pendingZoomNodeId.current);

    if (node) {
      zoomToNode(node);
    }

    pendingZoomNodeId.current = null;
  }, [nodes]);

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setExpandedIds(new Set([data.id]))}
          sx={{
            backgroundColor: "#e04f20",
            borderRadius: "20px",
          }}
        >
          Collapse
        </Button>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height="100vh"
        style={{ background: "#fff" }}
      >
        <g ref={gRef}>
          <TreeLinks links={links} />
          {nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              isExpanded={expandedIds.has(node.id)}
              onToggle={toggleNode}
              onSelect={onSelectNode}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}