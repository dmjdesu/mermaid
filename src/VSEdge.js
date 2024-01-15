import React from "react";
import { getBezierPath, getEdgeCenter } from "react-flow-renderer";

const VSEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = { stroke: "transparent" }, // 線を透明にする
  markerEndId,
}) => {
  // ベジェ曲線のパスを取得
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // エッジの中央の位置を取得
  const [centerX, centerY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEndId}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: 16 }}
          startOffset="50%"
          textAnchor="middle"
        >
          VS
        </textPath>
      </text>
    </>
  );
};

export default VSEdge;
