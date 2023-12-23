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
const heightPerItem = 5;
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
    height: "8%", // 初期値
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
    const baseHeight = 3; // 基本の高さ
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
      let fontWeight = "normal";

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
        fontWeight = "bold";
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
        },
      });
    });
    setNodes(tempNodes);
    setEdges(tempEdges);
  };

  return (
    <>
      <div ref={ref} style={{ width: "80vw", height: "80vh" }}>
        <svg style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <marker
              id="logo"
              viewBox="0 0 40 40"
              markerHeight={20}
              markerWidth={20}
              refX={20}
              refY={40}
            >
              <path
                d="M35 23H25C23.8954 23 23 23.8954 23 25V35C23 36.1046 23.8954 37 25 37H35C36.1046 37 37 36.1046 37 35V25C37 23.8954 36.1046 23 35 23Z"
                stroke="#1A192B"
                stroke-width="2"
                fill="white"
              />
              <path
                d="M35 3H25C23.8954 3 23 3.89543 23 5V15C23 16.1046 23.8954 17 25 17H35C36.1046 17 37 16.1046 37 15V5C37 3.89543 36.1046 3 35 3Z"
                stroke="#FF0072"
                stroke-width="2"
                fill="white"
              />
              <path
                d="M15 23H5C3.89543 23 3 23.8954 3 25V35C3 36.1046 3.89543 37 5 37H15C16.1046 37 17 36.1046 17 35V25C17 23.8954 16.1046 23 15 23Z"
                stroke="#1A192B"
                stroke-width="2"
                fill="white"
              />
              <path
                d="M15 3H5C3.89543 3 3 3.89543 3 5V15C3 16.1046 3.89543 17 5 17H15C16.1046 17 17 16.1046 17 15V5C17 3.89543 16.1046 3 15 3Z"
                stroke="#1A192B"
                stroke-width="2"
                fill="white"
              />
              <path
                d="M17 13C18.6569 13 20 11.6569 20 10C20 8.34315 18.6569 7 17 7C15.3431 7 14 8.34315 14 10C14 11.6569 15.3431 13 17 13Z"
                fill="white"
              />
              <path
                d="M23 13C24.6569 13 26 11.6569 26 10C26 8.34315 24.6569 7 23 7C21.3431 7 20 8.34315 20 10C20 11.6569 21.3431 13 23 13Z"
                fill="white"
              />
              <path
                d="M30 20C31.6569 20 33 18.6569 33 17C33 15.3431 31.6569 14 30 14C28.3431 14 27 15.3431 27 17C27 18.6569 28.3431 20 30 20Z"
                fill="white"
              />
              <path
                d="M30 26C31.6569 26 33 24.6569 33 23C33 21.3431 31.6569 20 30 20C28.3431 20 27 21.3431 27 23C27 24.6569 28.3431 26 30 26Z"
                fill="white"
              />
              <path
                d="M17 33C18.6569 33 20 31.6569 20 30C20 28.3431 18.6569 27 17 27C15.3431 27 14 28.3431 14 30C14 31.6569 15.3431 33 17 33Z"
                fill="white"
              />
              <path
                d="M23 33C24.6569 33 26 31.6569 26 30C26 28.3431 24.6569 27 23 27C21.3431 27 20 28.3431 20 30C20 31.6569 21.3431 33 23 33Z"
                fill="white"
              />
              <path
                d="M30 25C31.1046 25 32 24.1046 32 23C32 21.8954 31.1046 21 30 21C28.8954 21 28 21.8954 28 23C28 24.1046 28.8954 25 30 25Z"
                fill="#1A192B"
              />
              <path
                d="M17 32C18.1046 32 19 31.1046 19 30C19 28.8954 18.1046 28 17 28C15.8954 28 15 28.8954 15 30C15 31.1046 15.8954 32 17 32Z"
                fill="#1A192B"
              />
              <path
                d="M23 32C24.1046 32 25 31.1046 25 30C25 28.8954 24.1046 28 23 28C21.8954 28 21 28.8954 21 30C21 31.1046 21.8954 32 23 32Z"
                fill="#1A192B"
              />
              <path opacity="0.35" d="M22 9.5H18V10.5H22V9.5Z" fill="#1A192B" />
              <path
                opacity="0.35"
                d="M29.5 17.5V21.5H30.5V17.5H29.5Z"
                fill="#1A192B"
              />
              <path
                opacity="0.35"
                d="M22 29.5H18V30.5H22V29.5Z"
                fill="#1A192B"
              />
              <path
                d="M17 12C18.1046 12 19 11.1046 19 10C19 8.89543 18.1046 8 17 8C15.8954 8 15 8.89543 15 10C15 11.1046 15.8954 12 17 12Z"
                fill="#1A192B"
              />
              <path
                d="M23 12C24.1046 12 25 11.1046 25 10C25 8.89543 24.1046 8 23 8C21.8954 8 21 8.89543 21 10C21 11.1046 21.8954 12 23 12Z"
                fill="#FF0072"
              />
              <path
                d="M30 19C31.1046 19 32 18.1046 32 17C32 15.8954 31.1046 15 30 15C28.8954 15 28 15.8954 28 17C28 18.1046 28.8954 19 30 19Z"
                fill="#FF0072"
              />
            </marker>
          </defs>
        </svg>
        <ReactFlow
          nodes={nodes}
          edges={edges}
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
      <button onClick={downloadScreenshot}>Download screenshot</button>
      <br />
      <textarea
        value={text}
        rows={10}
        cols={100}
        onChange={(v) => {
          setText(v.target.value);
        }}
        onBlur={(v) => {
          changeText(v.target.value);
        }}
      />
    </>
  );
}

export default App;
