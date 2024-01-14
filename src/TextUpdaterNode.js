import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = {};

function TextUpdaterNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <div style={styles.customNode}>
        <div style={styles.title}>{data.title}</div>
        <div style={styles.body}>{data.body}</div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>
    </>
  );
}

const styles = {
  customNode: {
    border: "1px solid #222",
    padding: "10px",
    borderRadius: "3px",
    position: "relative", // タイトルを絶対位置で配置するため
  },
  title: {
    position: "absolute", // 絶対位置
    top: "-20px", // ノードの上に配置
    left: "50%", // ノードの中央
    transform: "translateX(-50%)", // 左右中央に配置
    background: "#fff", // 背景色
    padding: "5px", // パディング
    border: "1px solid #000", // 境界線
    borderRadius: "3px", // 境界線の角丸
  },
  body: {
    marginTop: "20px", // タイトルの下にスペースを作る
  },
};

const customNodeStyle = {
  textUpdaterNode: {
    height: "50px",
    border: "1px  #fff",
    padding: "5px",
    borderRadius: "5px",
    background: "white",
  },
  nodeTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  nodeBody: {
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default TextUpdaterNode;
