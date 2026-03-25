import { useEffect, useRef } from "react";
import type { PositionedNode } from "../types/tree";
import { Tooltip, Box, Typography } from "@mui/material";
import ExeIcon from "./icons/ExeIcon";
import GearsIcon from "./icons/GearsIcon";
import FileIcon from "./icons/FileIcon";
import ShieldIcon from "./icons/ShieldIcon";
import GearIcon from "./icons/GearIcon";

interface Props {
  node: PositionedNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onSelect: (data: PositionedNode["data"]) => void;
}

export function TreeNode({ node, isExpanded, onToggle, onSelect }: Props) {
  const gRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!gRef.current) return;

    gRef.current.style.transition =
      "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)";

    gRef.current.style.transform = `translate(${node.y}px, ${node.x}px)`;
  }, [node.x, node.y]);

  const tooltip = (
    <Box sx={{ p: 0.5 }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: "bold", color: "#e04f20" }}
      >
        {node.name}
      </Typography>
      <Typography variant="h6" sx={{ color: "white" }}>
        Process: {node.data.pid}
      </Typography>

      {history.length > 0 && (
        <Box>
          {node.data.timeSeries.map((time, i) => (
            <Typography
              key={i}
              variant="caption"
              display="block"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              {time.date}: <strong>{time.value}</strong>
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
  return (
    <g ref={gRef}>
      <Tooltip title={tooltip} arrow placement="left">
        <g cursor="pointer" onClick={() => onSelect(node.data)}>
          <circle
            r={22}
            fill={node.id === "root" ? "#6b09ea" : "#f50018"}
            stroke={node.id === "root" ? "#f50018" : "none"}
            strokeWidth={1.5}
          />
          <GearIcon />
          <ShieldIcon status={node.data.status} />
        </g>
      </Tooltip>

      {/* {node.id === "root" && (
        <g transform={`translate(-22, 0.5)`} cursor="pointer">
          <circle r={5.5} fill="#fff" stroke="#4592be" />
          <g transform="translate(0,0.4)">
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#4592be"
              fontSize={11}
              pointerEvents="none"
            >
              +
            </text>
          </g>
        </g>
      )} */}
      {!!node.data.children?.length && (
        <g
          transform={`translate(22, 0.5)`}
          cursor="pointer"
          onClick={() => {
            onToggle(node.id);
          }}
        >
          <circle r={5.5} fill="#fff" stroke="#4592be" />
          <g transform="translate(0,0.4)">
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#4592be"
            fontSize={11}
            pointerEvents="none"
          >
            {isExpanded ? "–" : "+"}
          </text>
          </g>
        </g>
      )}
      <g transform="translate(0,30)">
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
          fontSize={10}
          pointerEvents="none"
        >
          <tspan x="0" dy="0" fontWeight="bold">
            {node.name}
          </tspan>
          <tspan x="0" dy="1.2em" fill="#666">
            PID: {node.data.pid}
          </tspan>
        </text>
        <g transform="translate(-18,17) scale(0.2)">
          {node.data.icons.map((icon) => {
            if (icon === "exe") return <ExeIcon />;
            else if (icon === "file") return <FileIcon />;
            else if (icon === "gears") return <GearsIcon />;
          })}
        </g>
      </g>
    </g>
  );
}
