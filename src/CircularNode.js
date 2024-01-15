import React from "react";
import { Handle, Position } from "reactflow";

const CircularNode = ({ data, isConnectable }) => {
  return (
    <>
      <div style={styles.customNode}>
        <div style={styles.circle}></div>
        <div style={styles.content}>{data.body}</div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </>
  );
};

const styles = {
  customNode: {
    position: "relative", // 絶対位置指定の子要素を持つため
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px", // 円からの余白
  },
  circle: {
    position: "absolute", // 背景円を中央に配置
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100px", // 円の直径
    height: "100%", // 円の直径
    backgroundColor: "white", // 円の背景色
    borderRadius: "50%", // 円形にする
    border: "2px solid blue", // 枠線
    zIndex: 0, // 円を背景に配置
  },
  content: {
    zIndex: 1, // 内容を前面に配置
    // 内容のスタイルをここに追加
  },
};

export default CircularNode;
