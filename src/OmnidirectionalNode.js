import { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = {};

function OmnidirectionalNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  console.log(data.body);

  return (
    <>
      <div style={{ ...styles.customNode, overflow: "visible" }}>
        {data.title && <div style={styles.title}>{data.title}</div>}
        <div style={styles.body}>{data.label}</div>
        <Handle
          type="target"
          position="top"
          id="udlr_top"
          style={{ background: "#555" }}
        />
        <Handle
          type="source"
          position="bottom"
          id="udlr_bottom"
          style={{ background: "#555" }}
        />
        <Handle
          type="source"
          position="right"
          id="udlr_right"
          style={{ background: "#555" }}
        />
        <Handle
          type="target"
          position="left"
          id="udlr_left"
          style={{ background: "#555" }}
        />
      </div>
    </>
  );
}

const styles = {
  customNode: {
    border: "1px solid #222",
    padding: "10px",
    borderRadius: "3px",
    position: "relative", // これを追加
  },
  title: {
    position: "absolute",
    top: "-20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    padding: "5px",
    border: "1px solid #000",
    borderRadius: "3px",
    zIndex: 1000, // 既にあるのでそのまま
  },
  body: {
    marginTop: "20px",
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

export default OmnidirectionalNode;
