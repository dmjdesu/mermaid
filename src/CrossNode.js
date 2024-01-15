import React from "react";
import { Handle, Position } from "reactflow";

const CrossNode = ({ data, isConnectable }) => {
  return (
    <>
      <div style={styles.customNode}>
        <div style={styles.cross}>
          <div style={styles.line}></div>
          <div style={styles.reverseLine}></div>
        </div>
        <div style={styles.content}>{data.body}</div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </>
  );
};

const styles = {
  customNode: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  cross: {
    position: "absolute",
    width: "100px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  line: {
    position: "absolute",
    width: "80%", // 親要素の対角線の長さに近似する
    height: "2px", // 線の太さ
    backgroundColor: "red", // 線の色
    transform: "rotate(45deg)", // 左上から右下への線
    transformOrigin: "0 0", // 回転の基点を左上に設定
    top: "20%", // 親要素の上端から開始
    left: "0", // 親要素の左端から開始
  },
  reverseLine: {
    position: "absolute",
    width: "80%", // 親要素の対角線の長さに近似する
    height: "2px", // 線の太さ
    backgroundColor: "red", // 線の色
    transform: "rotate(-45deg)", // 左上から右下への線
    transformOrigin: "0 0", // 回転の基点を左上に設定
    top: "75%", // 親要素の上端から開始
    left: "0", // 親要素の左端から開始
  },
  content: {
    zIndex: 1,
    position: "relative",
  },
};

// この部分は、第一の線と第二の線のスタイルを別々に設定する
const line1Style = { ...styles.line, transform: "rotate(45deg)" };
const line2Style = { ...styles.line, transform: "rotate(-45deg)" };

export default CrossNode;
