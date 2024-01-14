import React, { useEffect, createRef, useRef, useState } from "react";
import ReactFlow, {
  Panel,
  useNodesState,
  MarkerType,
  getMarkerEnd,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import * as htmlToImage from "html-to-image";
import VSEdge from "./VSEdge";
import RightAngleEdge from "./RightAngleEdge";
import TextUpdaterNode from "./TextUpdaterNode";
import OmnidirectionalNode from "./OmnidirectionalNode";

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  omnidirectional: OmnidirectionalNode,
};

const contentBaseHeight = 50;
const heightPerItem = 2;
const contentHeightItem = 30;

function createMultiNode(
  index,
  height,
  width,
  margin,
  label,
  contentWidth,
  tempWidth,
  fontSize,
  fontWeight,
  borderColor,
  tempTitleArray
) {
  return {
    multitype: "multi",
    id: String(index + 1),
    position: {
      x: width * contentWidth + margin,
      y:
        height * 100 +
        tempTitleArray.length * contentHeightItem +
        contentBaseHeight,
    },
    data: { label: label },
    style: {
      width: tempWidth,
      fontSize: fontSize,
      fontWeight: fontWeight,
      border: borderColor,
      overflow: "hidden",
    },
  };
}

function createOriginalNode(
  index,
  height,
  width,
  margin,
  label,
  contentWidth,
  fontSize,
  fontWeight,
  borderColor,
  tempTitleArray
) {
  return {
    multitype: "single",
    id: String(index + 1),
    position: {
      x: width * 200 + margin,
      y:
        height * 100 +
        tempTitleArray.length * contentHeightItem +
        contentBaseHeight,
    },
    data: { label: label },
    style: {
      width: contentWidth,
      fontSize: fontSize,
      fontWeight: fontWeight,
      border: borderColor,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  };
}

function createTitleNode(
  index,
  height,
  width,
  margin,
  title,
  body,
  contentWidth,
  fontSize,
  fontWeight,
  borderColor,
  tempTitleArray
) {
  return {
    multitype: "single",
    id: String(index + 1),
    position: {
      x: width * 200 + margin,
      y:
        height * 100 +
        tempTitleArray.length * contentHeightItem +
        contentBaseHeight,
    },
    type: "textUpdater",
    data: {
      title: title,
      body: body,
    },
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: "solid 4px #000",
    },
  };
}

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 110 },
    type: "textUpdater",
    data: {
      title: "覚醒",
      body: "いつまでもそんなことは言ってられない、ぐだぐだ言わずに手をつけました。",
    },
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: "solid 4px #000",
    },
  },
  {
    id: "2",
    position: { x: 0, y: 210 },
    data: {
      label:
        "最初にしたのが「もしどら」の「マネジメントエッセンシャル版」でした",
    },
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: "solid 4px #000",
    },
  },
  {
    id: "3",
    position: { x: 200, y: 310 },
    data: {
      label: "これはつらい、、、",
    },
    style: {
      width: 400,
      fontSize: "12px",
      fontWeight: 700,
      border: "solid 4px #000",
    },
  },
  {
    id: "4",
    position: { x: 0, y: 410 },
    data: {
      label: "俺は長男だから我慢できたけど次男だったら我慢できなかった",
    },
    style: {
      width: 800,
      fontSize: "20px",
      fontWeight: 900,
      border: "solid 4px #000",
    },
  },
  {
    id: "5",
    position: { x: 0, y: 510 },
    data: {
      label: "少しやったら止まり、他の本のチャート化を優先したり、、",
    },
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: "solid 4px #000",
    },
  },
  {
    id: "6",
    position: { x: 0, y: 110 },
    data: {
      label:
        "いつまでもそんなことは言ってられない、ぐだぐだ言わずに手をつけました。",
    },
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: "solid 4px #000",
    },
  },
  {
    id: "6",
    position: { x: 0, y: 610 },
    data: {
      label: "「完成」するのに「５年」かかりました。",
    },
    style: {
      width: 800,
      fontSize: "20px",
      fontWeight: 900,
      border: "solid 4px #000",
    },
  },
];
const initialEdges = [
  {
    id: "e1-0",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    type: "custom",
    source: "1",
    target: "2",
  },
  {
    id: "e1-1",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    source: "2",
    target: "3",
  },
  {
    id: "e1-2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    source: "3",
    target: "4",
  },
  {
    id: "e1-3",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    source: "4",
    target: "5",
  },
  {
    id: "e1-4",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000000",
    },
    source: "5",
    target: "6",
  },
];

const createFileName = (extension = "", ...names) => {
  if (!extension) {
    return "";
  }

  return `${names.join("")}.${extension}`;
};

function App() {
  const [text, setText] = useState(
    "{「チャートで考えればうまくいく」セブンチャート仕事術＞の誕生物語}\n" +
      "{（続）10.0ドラッガーとの出会い}\n" +
      "(title:覚醒)いつまでもそんなことは言ってられない、ぐだぐだ言わずに手をつけました。\n" +
      "最初にしたのが「もしどら」の「マネジメントエッセンシャル版」でした\n" +
      "(small)これはつらい、、、\n" +
      "(bold)俺は長男だから我慢できたけど次男だったら我慢できなかった\n" +
      "少しやったら止まり、他の本のチャート化を優先したり、、\n" +
      "(bold)「完成」するのに「５年」かかりました。"
  );
  const [containerStyle, setContainerStyle] = useState({
    border: "none", // 他の境界線を無効化
    borderBottom: "solid 2px #000", // 下線のみ設定
    width: "95%",
    height: "3%", // 初期値
    margin: 0,
  });
  const [titleArray, setTitleArray] = useState([
    "「チャートで考えればうまくいく」セブンチャート仕事術＞の誕生物語",
    "（続）10.0ドラッガーとの出会い",
  ]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const ref = createRef(null);
  const textAreaRef = useRef(null);

  const insertTextAtCursor = (insertText) => {
    const textarea = textAreaRef.current;
    console.log("textarea");
    console.log(textarea);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + insertText + text.substring(end);
    setText(newText);
    changeText(newText);

    // カーソルを挿入テキストの後ろに設定
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + insertText.length;
    }, 0);
  };

  const handleinsertClick = (text) => {
    insertTextAtCursor(text);
  };

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

  const changeText = (v) => {
    let text = v;
    let lines = text.split("\n");
    let tempNodes = [];
    let tempEdges = [];
    let nodeesArray = [];
    let tempTitleArray = [];
    let multiArray = [];

    setTitleArray([]);
    lines.forEach((line, index) => {
      const regex = /\{(.*?)\}/;
      const match = line.match(regex);
      if (match) {
        const extractedText = match[1];
        tempTitleArray.push(extractedText);
      } else {
        const multiPattern = /\(multi\)/;
        // 正規表現に一致するかテスト
        if (multiPattern.test(line)) {
          // 一致した場合の処理
          console.log("一致しました！");
          const newText = line.replace(multiPattern, "");
          console.log(newText);
          multiArray.push(newText);
        } else {
          if (multiArray.length > 0) {
            nodeesArray.push({
              type: "array",
              id: String(index),
              data: multiArray,
            });
            multiArray = [];
          }
          console.log("line");
          console.log(line);
          if (line) {
            nodeesArray.push({
              type: "word",
              id: String(index + 1),
              data: { label: line },
            });
          }
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

    let indexMargin = 0;
    const smallPattern = /\(small\)/;
    const boldPattern = /\(bold\)/;
    const titlePattern = /\(title:([^)]*)\)/;
    const vsPattern = /\(vs\)/;

    nodeesArray.forEach((node, index) => {
      let height = index;

      let width = 0;

      let fontSize = "15px";
      let contentWidth = 800;
      let margin = 0;
      let fontWeight = 700;
      let borderColor = "solid 4px #000";

      if (node.type === "array") {
        contentWidth = contentWidth / node.data.length;
        let tempWidth = contentWidth - node.data.length * 10;

        node.data.forEach((line, arrayindex) => {
          console.log("arrayindex * width");
          console.log(arrayindex * width);
          tempNodes.push(
            createMultiNode(
              index + arrayindex,
              height,
              arrayindex,
              margin,
              line,
              contentWidth,
              tempWidth,
              fontSize,
              fontWeight,
              borderColor,
              tempTitleArray
            )
          );
        });
        console.log("node.data.length");
        console.log(node.data.length);
        indexMargin += node.data.length - 1;
        console.log("indexMargin");
        console.log(indexMargin);
      } else if (node.type === "word") {
        if (titlePattern.test(node.data.label)) {
          const pattern = /title:([^)]*)\)/;
          const match = node.data.label.match(pattern);
          const extractedText = match[1]; // 抜き出される文字
          const newText = node.data.label.replace(/\(title:[^)]*\)/, ""); // 全て除去
          console.log("extractedText");
          console.log(extractedText);
          tempNodes.push(
            createTitleNode(
              index + indexMargin,
              height,
              width,
              margin,
              extractedText,
              newText,
              contentWidth,
              fontSize,
              fontWeight,
              borderColor,
              tempTitleArray
            )
          );
        } else if (smallPattern.test(node.data.label)) {
          node.data.label = node.data.label.replace(smallPattern, "");
          fontSize = "12px";
          contentWidth = 400;
          margin = 200;

          // (small) パターンに一致した場合のノードを作成
          tempNodes.push(
            createOriginalNode(
              index + indexMargin,
              height,
              width,
              margin,
              node.data.label,
              contentWidth,
              fontSize,
              fontWeight,
              borderColor,
              tempTitleArray
            )
          );
        } else if (boldPattern.test(node.data.label)) {
          node.data.label = node.data.label.replace(boldPattern, "");
          fontWeight = 900;
          fontSize = "20px";

          // (bold) パターンに一致した場合のノードを作成
          tempNodes.push(
            createOriginalNode(
              index + indexMargin,
              height,
              width,
              margin,
              node.data.label,
              contentWidth,
              fontSize,
              fontWeight,
              borderColor,
              tempTitleArray
            )
          );
        } else {
          // どのパターンにも一致しない場合のノードを作成
          tempNodes.push(
            createOriginalNode(
              index + indexMargin,
              height,
              width,
              margin,
              node.data.label,
              contentWidth,
              fontSize,
              fontWeight,
              borderColor,
              tempTitleArray
            )
          );
        }
      }
    });
    console.log("tempNodes");
    console.log(tempNodes);
    setNodes(tempNodes);
    tempNodes.forEach((node, index) => {
      if (tempNodes.length !== index + 1) {
        if (node.multitype === "single") {
          tempEdges.push({
            id: "e1-" + index,
            source: String(index + 1),
            target: String(index + 2),
            type: "right",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#000000",
            },
          });
          let tempIndex = index;
          while (true) {
            if (tempNodes[tempIndex + 1]["multitype"] === "multi") {
              tempEdges.push({
                id: "e1-" + String(tempIndex) + String(index),
                source: String(index + 1),
                target: String(tempIndex + 2),
                type: "right",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: "#000000",
                },
              });
            } else {
              break;
            }
            if (tempIndex + 2 >= tempNodes.length) {
              break;
            }
            tempIndex += 1;
          }
        } else if (node.multitype === "multi") {
          tempNodes[index]["type"] = "omnidirectional";
          console.log("tempNodes[index]");
          console.log(tempNodes[index]);
          if (tempNodes[index + 1]["multitype"] === "multi") {
            if (vsPattern.test(tempNodes[index]["data"]["label"])) {
              tempNodes[index]["data"]["label"] = tempNodes[index]["data"][
                "label"
              ].replace(vsPattern, "");
              tempEdges.push({
                id: "e1-" + index,
                source: String(index + 1),
                target: String(index + 2),
                sourceHandle: "udlr_right",
                targetHandle: "udlr_left",
                type: "custom",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: "#000000",
                },
              });
            } else {
              tempEdges.push({
                id: "e1-" + index,
                source: String(index + 1),
                target: String(index + 2),
                sourceHandle: "udlr_right",
                targetHandle: "udlr_left",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: "#000000",
                },
              });
            }
          }
          let tempIndex = index;
          while (true) {
            if (tempNodes[tempIndex + 1]["multitype"] === "single") {
              tempEdges.push({
                id: "e1-" + String(tempIndex) + String(index),
                source: String(index + 1),
                target: String(tempIndex + 2),
                type: "right",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 20,
                  height: 20,
                  color: "#000000",
                },
              });
              break;
            }
            tempIndex += 1;
          }
          // tempEdges.push({
          //   id: "e1-" + index,
          //   source: String(index + 1),
          //   target: String(index + 2),
          //   markerEnd: {
          //     type: MarkerType.ArrowClosed,
          //     width: 20,
          //     height: 20,
          //     color: "#000000",
          //   },
          // });
        }
      }
    });
    console.log("tempEdges");
    console.log(tempEdges);
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
              edgeTypes={{ custom: VSEdge, right: RightAngleEdge }}
              nodeTypes={nodeTypes}
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
          <button onClick={downloadScreenshot}>ダウンロード</button>
          <button onClick={() => changeText(text)}>反映</button>
          <button onClick={() => handleinsertClick("{}")}>タイトル</button>
          <button onClick={() => handleinsertClick("(bold)")}>太く</button>
          <button onClick={() => handleinsertClick("(small)")}>小さく</button>
          <br />
          <textarea
            ref={textAreaRef}
            value={text}
            rows={100}
            cols={50}
            onChange={(v) => {
              setText(v.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
