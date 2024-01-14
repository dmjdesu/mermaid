const RightAngleEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // エッジが最初に下に行く距離を計算
  const firstVerticalMove = Math.abs(targetY - sourceY) / 2;
  // エッジが左に折れ曲がる点
  const middleY = sourceY + firstVerticalMove;
  // エッジのパス
  const edgePath = `M${sourceX},${sourceY} V${middleY} H${targetX} V${targetY}`;

  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

export default RightAngleEdge;
