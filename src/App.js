import React, { useEffect, createRef, useState } from "react";
import ReactFlow, {
  Panel,
  useNodesState,
  MarkerType,
  getMarkerEnd,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import * as htmlToImage from "html-to-image";
import CustomEdge from "./CustomEdge";

const contentBaseHeight = 50;
const heightPerItem = 2;
const contentHeightItem = 30;

const initialNodes = [
  { id: "1", position: { x: 0, y: 50 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 150 }, data: { label: "2" } },
  { id: "3", position: { x: 200, y: 150 }, data: { label: "3" } },
];
const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];

const createFileName = (extension = "", ...names) => {
  if (!extension) {
    return "";
  }

  return `${names.join("")}.${extension}`;
};

function App() {
  const [text, setText] = useState("1\n2\n3\n1->2\n1->3");
  const [containerStyle, setContainerStyle] = useState({
    border: "none", // 他の境界線を無効化
    borderBottom: "solid 2px #000", // 下線のみ設定
    width: "95%",
    height: "3%", // 初期値
    margin: 0,
  });
  const [titleArray, setTitleArray] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const ref = createRef(null);
  const [contentHeight, setContentHeight] = useState(50);

  const takeScreenShot = async (node) => {
    const dataURI = await htmlToImage.toJpeg(node, {
      quality: 0.95,
      backgroundColor: "#ffffff",
    });
    return dataURI;
  };

  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  const regex = /\{(.*?)\}/;

  const changeText = (v) => {
    let text = v;
    let lines = text.split("\n");
    let tempNodes = [];
    let tempEdges = [];
    let edgesArray = [];
    let nodeesArray = [];
    let tempTitleArray = [];

    setTitleArray([]);
    lines.forEach((line, index) => {
      const match = line.match(regex);
      if (match) {
        const extractedText = match[1];
        console.log("Extracted Text: ", extractedText);
        tempTitleArray.push(extractedText);
      } else {
        let maxX = 0;
        let maxY = 0;
        initialNodes.forEach((node) => {
          if (node.position.x > maxX) {
            maxX = node.position.x;
          }
          if (node.position.y > maxY) {
            maxY = node.position.y;
          }
        });

        if (line) {
          nodeesArray.push({
            id: String(index + 1),
            data: { label: line },
          });
          console.log("setNodes");
        }
      }
    });
    setTitleArray(tempTitleArray);
    const baseHeight = 0; // 基本の高さ
    // 各要素に追加する高さの割合

    // スタイルを更新する
    setContainerStyle((prevStyle) => ({
      ...prevStyle,
      height: `${baseHeight + tempTitleArray.length * heightPerItem}%`, // 高さを動的に計算
    }));
    console.log("titleArray.length");
    console.log(titleArray.length);

    nodeesArray.forEach((node, index) => {
      let height = index;

      let width = 0;

      console.log("tempTitleArray");
      console.log(tempTitleArray);
      if (nodeesArray.length >= index + 2) {
        tempEdges.push({
          id: "e1-" + index,
          source: String(index + 1),
          target: String(index + 2),
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#000000",
          },
        });
      }

      let fontSize = "15px";
      let contentWidth = 800;
      let margin = 0;
      let fontWeight = 700;
      let borderColor = "solid 4px #000";

      let pattern = /\(small\)/;
      if (pattern.test(node.data.label)) {
        node.data.label = node.data.label.replace(pattern, "");
        fontSize = "12px";
        contentWidth = 400;
        margin = 200;
      }
      pattern = /\(bold\)/;
      if (pattern.test(node.data.label)) {
        node.data.label = node.data.label.replace(pattern, "");
        fontWeight = 900;
        fontSize = "20px";
      }

      tempNodes.push({
        id: String(index + 1),
        position: {
          x: width * 200 + margin,
          y:
            height * 100 +
            tempTitleArray.length * contentHeightItem +
            contentBaseHeight,
        },
        data: { label: node.data.label },
        style: {
          width: contentWidth,
          fontSize: fontSize,
          fontWeight: fontWeight,
          border: borderColor,
        },
      });
    });
    setNodes(tempNodes);
    setEdges(tempEdges);
  };

  return (
    <>
      <div style={{ display: "flex", height: "200vh" }}>
        <div style={{ flex: 2, overflow: "auto" }}>
          {" "}
          {/* React Flowのコンテンツ */}
          <div
            ref={ref}
            style={{ width: "80vw", height: "200vh", overflow: "auto" }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onLoad={(reactFlowInstance) => reactFlowInstance.fitView()}
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
              edgeTypes={{ custom: CustomEdge }}
              snapToGrid={true}
              key="edges"
            >
              <Panel style={containerStyle} position="top-left">
                {titleArray.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Panel>
            </ReactFlow>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {" "}
          {/* 右側のセクション */}
          <button onClick={downloadScreenshot}>Download screenshot</button>
          <br />
          <textarea
            value={text}
            rows={100}
            cols={50}
            onChange={(v) => {
              setText(v.target.value);
            }}
            onBlur={(v) => {
              changeText(v.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
