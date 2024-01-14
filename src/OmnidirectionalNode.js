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
      <div style={styles.customNode}>
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
    position: "relative", // タイトルを絶対位置で配置するため
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
