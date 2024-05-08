import { Handle, Position } from "reactflow";


const CustomNode = ({ data }) => {

  return (
    <div style={{ ...styles.customNode}}>
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const styles = {
  customNode: {
    border: "1px solid #222",
    padding: "10px",
    borderRadius: "3px",
    position: "relative", // これは既にあるのでそのまま
    textAlign: "center", // テキストを中央揃えにする
    display: "flex", // フレックスコンテナにする
    flexDirection: "column", // 子要素を縦方向に配置
    alignItems: "center", // 水平方向（主軸）の中央揃え
    justifyContent: "center", // 垂直方向（交差軸）の中央揃え
  },
  body: {
    marginTop: "20px",
  },
};


export default CustomNode;