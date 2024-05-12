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
import CustomNode from "./CustomNode";
import OmnidirectionalNode from "./OmnidirectionalNode";
import "./App.css";

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  omnidirectional: OmnidirectionalNode,
  custom: CustomNode,
};


function calculateMaxWords(text) {
  let outputText = "";  // 出力用の文字列を初期化
  let count = 0;        // 見かけ上の文字カウント（全角は2、半角は1でカウント）
  let lineCount = 1

  // 文字列を1文字ずつ走査
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // 現在の文字が全角か半角か判定
    const isFullWidth = (char.match(/[^\x00-\xff]/) !== null);
    // 全角なら2を加算、半角なら1を加算
    count += isFullWidth ? 2 : 1;

    // 文字を出力文字列に追加
    outputText += char;

    // カウントが90以上になったら改行を挿入し、カウントをリセット
    if (count >= 90) {
      outputText += "\n";
      lineCount += 1;
    }
  }


  return { outputText, lineCount}
}

function calculateMaxLines(array) {
  if(!array) return 0;
  // 列ごとの最大文字数をマッピング
  const maxCharsPerColumn = {
    1: 50,
    2: 23,
    3: 13,
    4: 8,
    5: 5,
    6: 2,
  };

  let maxLines = 0;

  let maxChars = maxCharsPerColumn[array.length];

  // 配列をループして、各要素の行数を計算し、最大値を更新する
  for (let i = 0; i < array.length; i++) {
    let columns = array[i];
    let linesForElement = Math.ceil(columns.length / maxChars);

    if (linesForElement > maxLines) {
      maxLines = linesForElement;
    }
  }

  return maxLines;
}

const contentBaseHeight = 50;
const heightPerItem = 2;
const contentHeightItem = 30;
const borderColor = "solid 4px #000";
let border = borderColor;
let fontFamily = "HGP創英角ｺﾞｼｯｸUB";
let strokeWidth = 2;
let heightMargin = 40;

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
  tempTitleArray,
  duplicateLineCount,
  fontFamily
) {
  return {
    multitype: "multi",
    id: String(index + 1),
    position: {
      x: width * contentWidth + margin,
      y:
        height * heightMargin +
        duplicateLineCount * 30 +
        tempTitleArray.length * contentHeightItem +
        contentBaseHeight,
    },
    type: "custom",
    data: { label: label },
    style: {
      width: tempWidth,
      fontSize: fontSize,
      fontWeight: fontWeight,
      border: borderColor,
      overflow: "hidden",
      fontFamily: fontFamily,
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
  tempTitleArray,
  duplicateLineCount,
  fontFamily
) {
  return {
    multitype: "single",
    id: String(index + 1),
    position: {
      x: width * 200 + margin,
      y:
        height * heightMargin +
        duplicateLineCount * 30 +
        tempTitleArray.length * contentHeightItem +
        contentBaseHeight,
    },
    type: "custom",
    data: { label: label },
    style: {
      width: contentWidth,
      fontSize: fontSize,
      fontWeight: fontWeight,
      border: borderColor,
      fontFamily: fontFamily,
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
  tempTitleArray,
  duplicateLineCount,
  fontFamily
) {
  return {
    multitype: "single",
    id: String(index + 1),
    position: {
      x: width * 200 + margin,
      y:
        height * heightMargin +
        duplicateLineCount * 30 +
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
      fontSize: fontSize,
      fontWeight: 700,
      border: borderColor,
      textAlign: "center",
      fontFamily: fontFamily,
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
      border: borderColor,
      textAlign: "center",
      fontFamily: "HGP創英角ｺﾞｼｯｸUB",
    },
  },
  {
    id: "2",
    position: { x: 0, y: 190 },
    data: {
      label:
        "最初にしたのが「もしどら」の「マネジメントエッセンシャル版」でした",
    },
    type: "custom",
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: borderColor,
      fontFamily: "HGP創英角ｺﾞｼｯｸUB",
    },
  },
  {
    id: "3",
    position: { x: 0, y: 270 },
    data: {
      label: "これはつらい、、、",
    },
    type: "custom",
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: borderColor,
      fontFamily: "HGP創英角ｺﾞｼｯｸUB",
    },
  },
  {
    id: "4",
    position: { x: 0, y: 350 },
    data: {
      label: "俺は長男だから我慢できたけど次男だったら我慢できなかった",
    },
    type: "custom",
    style: {
      width: 800,
      fontSize: "20px",
      fontWeight: 900,
      border: borderColor,
      fontFamily: "HGP創英角ｺﾞｼｯｸUB",
    },
  },
  {
    id: "5",
    position: { x: 0, y: 430 },
    data: {
      label: "少しやったら止まり、他の本のチャート化を優先したり、、",
    },
    type: "custom",
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: borderColor,
      fontFamily: "HGP創英角ｺﾞｼｯｸUB",
    },
  },
  {
    id: "6",
    position: { x: 0, y: 110 },
    data: {
      label:
        "いつまでもそんなことは言ってられない、ぐだぐだ言わずに手をつけました。",
    },
    type: "custom",
    style: {
      width: 800,
      fontSize: "15px",
      fontWeight: 700,
      border: borderColor,
      fontFamily: "HGP創英角ｺﾞｼｯｸUB",
    },
  },
  {
    id: "6",
    position: { x: 0, y: 510 },
    data: {
      label: "「完成」するのに「５年」かかりました。",
    },
    type: "custom",
    style: {
      width: 800,
      fontSize: "20px",
      fontWeight: 900,
      border: borderColor,
      fontFamily: "HGP創英角ｺﾞｼｯｸUB",
    },
  },
];
const initialEdges = [
  {
    id: "e1-0",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 5,
      height: 5,
      color: "#000000",
    },
    source: "1",
    target: "2",
    style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
  },
  {
    id: "e1-1",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 5,
      height: 5,
      color: "#000000",
    },
    source: "2",
    target: "3",
    style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
  },
  {
    id: "e1-2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 5,
      height: 5,
      color: "#000000",
    },
    source: "3",
    target: "4",
    style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
  },
  {
    id: "e1-3",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 5,
      height: 5,
      color: "#000000",
    },
    source: "4",
    target: "5",
    style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
  },
  {
    id: "e1-4",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 5,
      height: 5,
      color: "#000000",
    },
    source: "5",
    target: "6",
    style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
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
      "これはつらい、、、\n" +
      "俺は長男だから我慢できたけど次男だったら我慢できなかった\n" +
      "少しやったら止まり、他の本のチャート化を優先したり、、\n" +
      "「完成」するのに「５年」かかりました。"
  );
  const [containerStyle, setContainerStyle] = useState({
    border: "none", // 他の境界線を無効化
    borderBottom: "solid 2px #000", // 下線のみ設定
    width: "95%",
    height: "4%", // 初期値
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


  function processString(line) {
    // 正規表現パターンで{intro}、{main}、{sup}を検出
    const regexIntro = /\(intro\)/;
    const regexMain = /\(main\)/;
    const regexSup = /\(sup\)/;

    // 各要素が存在するか確認
    const introMatch = regexIntro.exec(line);
    const mainMatch = regexMain.exec(line);
    const supMatch = regexSup.exec(line);

    if (introMatch) {
      const size = "12px";
      let text = line ? line.replace(regexIntro, "").trim() : ''; // line が存在しない場合は空文字列を代入
      return { size, text };
    } else if (mainMatch) {
      const size = "22px";
      let text = line ? line.replace(regexMain, "").trim() : ''; // line が存在しない場合は空文字列を代入
      return { size, text };
    } else if (supMatch) {
      const size = "17px";
      let text = line ? line.replace(regexSup, "").trim() : ''; // line が存在しない場合は空文字列を代入
      return { size, text };
    } else {
      const size = "15px";
      let text = line ? line.trim() : ''; // line が存在しない場合は空文字列を代入
      return { size, text };
    }
  }
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

  useEffect(() => {
    // 要素を選択
    const elements = document.querySelectorAll(
      ".react-flow__node.react-flow__node-omnidirectional.nopan.selectable"
    );

    // 各要素のスタイルを変更
    elements.forEach((element) => {
      element.style.overflow = "visible";
    });
  }, []);

  const changeText = (v) => {
    let text = v;
    let lines = text.split("\n");
    let tempNodes = [];
    let tempEdges = [];
    let nodeesArray = [];
    let tempTitleArray = [];
    let multiArray = [];
    let duplicateLineCount = 0;

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
          const newText = line.replace(multiPattern, "");
          multiArray.push(newText);
          if (lines.length === index + 1) {
            nodeesArray.push({
              type: "array",
              id: String(index),
              data: multiArray,
            });
            multiArray = [];
          }
        } else {
          if (
            (multiArray.length > 0 && multiArray.length < 7) ||
            (lines.length === index + 1 && multiArray.length > 0)
          ) {
            nodeesArray.push({
              type: "array",
              id: String(index),
              data: multiArray,
            });
            multiArray = [];
          }
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
    const titlePattern = /\(title:([^)]*)\)/;
    const vsPattern = /\(vs\)/;
    const linePattern = /\(line\)/;
    const nonPattern = /\(non\)/;


    nodeesArray.forEach((node, index) => {
      let height = index;

      let width = 0;

      let contentWidth = 800;
      let margin = 0;
      let fontWeight = 700;
      let fontData = processString(node.data.label);

      if (node.type === "array") {
        contentWidth = contentWidth / node.data.length;
        let tempWidth = contentWidth - node.data.length * 10;
        let totalMaxLines = calculateMaxLines(node.data.label);

        node.data.forEach((line, arrayindex) => {
          tempNodes.push(
            createMultiNode(
              index + arrayindex + indexMargin,
              height,
              arrayindex,
              margin,
              line,
              contentWidth,
              tempWidth,
              fontData.size,
              fontWeight,
              border,
              tempTitleArray,
              duplicateLineCount,
              fontFamily
            )
          );
        });
        if (node.data.label) duplicateLineCount += totalMaxLines - 1;
        indexMargin += node.data.length - 1;
      } else if (node.type === "word") {
        console.log("fontData")
        console.log(fontData)
        if (titlePattern.test(fontData.text)) {
          const pattern = /title:([^)]*)\)/;
          const match = fontData.text.match(pattern);
          const extractedText = match[1]; // 抜き出される文字
          const newText = fontData.text.replace(/\(title:[^)]*\)/, ""); // 全て除去
          const treatWord = calculateMaxWords(newText);
          tempNodes.push(
            createTitleNode(
              index + indexMargin,
              height,
              width,
              margin,
              extractedText,
              treatWord.outputText,
              contentWidth,
              fontData.size,
              fontWeight,
              border,
              tempTitleArray,
              duplicateLineCount,
              fontFamily
            )
          );
          if (fontData.text) duplicateLineCount += treatWord.lineCount;
        } else {
          // どのパターンにも一致しない場合のノードを作成
          const treatWord = calculateMaxWords(fontData.text);
          tempNodes.push(
            createOriginalNode(
              index + indexMargin,
              height,
              width,
              margin,
              treatWord.outputText,
              contentWidth,
              fontData.size,
              fontWeight,
              border,
              tempTitleArray,
              duplicateLineCount,
              fontFamily
            )
          );
          if (fontData.text) duplicateLineCount += treatWord.lineCount;
        }
      }
    });
    setNodes(tempNodes);

    let edgesIndex = 1;

    tempNodes.forEach((node, index) => {
      if (tempNodes.length >= index + 1) {
        if (node.multitype === "single") {
          tempEdges.push({
            id: "l1-" + edgesIndex,
            source: String(index + 1),
            target: String(index + 2),
            type: "right",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 5,
              height: 5,
              color: "#000000",
            },
            style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
          });
          edgesIndex += 1;
          let tempIndex = index;
          while (tempIndex + 1 < tempNodes.length) {
            if (tempNodes[tempIndex + 1]["multitype"] === "multi") {
              tempEdges.push({
                id: "l1-" + edgesIndex,
                source: String(index + 1),
                target: String(tempIndex + 2),
                type: "right",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 5,
                  height: 5,
                  color: "#000000",
                },
                style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
              });
              edgesIndex += 1;
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
          if (titlePattern.test(tempNodes[index]["data"]["label"])) {
            const pattern = /title:([^)]*)\)/;
            const match = tempNodes[index]["data"]["label"].match(pattern);
            const extractedText = match[1]; // 抜き出される文字
            tempNodes[index]["data"]["label"] = tempNodes[index]["data"][
              "label"
            ].replace(/\(title:[^)]*\)/, ""); // 全て除去
            tempNodes[index]["data"]["title"] = extractedText;
          }

          if (tempNodes.length === index + 1) {
            setEdges(tempEdges);
            return;
          }
          if (tempNodes[index + 1]["multitype"] === "multi") {
            if (vsPattern.test(tempNodes[index]["data"]["label"])) {
              tempNodes[index]["data"]["label"] = tempNodes[index]["data"][
                "label"
              ].replace(vsPattern, "");
              tempEdges.push({
                id: "l1-" + edgesIndex,
                source: String(index + 1),
                target: String(index + 2),
                sourceHandle: "udlr_right",
                targetHandle: "udlr_left",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 5,
                  height: 5,
                  color: "#000000",
                },
                type: "custom",
              });
              edgesIndex += 1;
            }
            if (linePattern.test(tempNodes[index]["data"]["label"])) {
              tempNodes[index]["data"]["label"] = tempNodes[index]["data"][
                "label"
              ].replace(linePattern, "");
              tempEdges.push({
                id: "l1-" + edgesIndex,
                source: String(index + 1),
                target: String(index + 2),
                sourceHandle: "udlr_right",
                targetHandle: "udlr_left",
                markerEnd: {
                  width: 5,
                  height: 5,
                  color: "#000000",
                },
                style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
              });
              edgesIndex += 1;
            } else if (nonPattern.test(tempNodes[index]["data"]["label"])) {
              tempNodes[index]["data"]["label"] = tempNodes[index]["data"][
                "label"
              ].replace(nonPattern, "");
            } else {
              tempEdges.push({
                id: "l1-" + edgesIndex,
                source: String(index + 1),
                target: String(index + 2),
                sourceHandle: "udlr_right",
                targetHandle: "udlr_left",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 5,
                  height: 5,
                  color: "#000000",
                },
                style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
              });
              edgesIndex += 1;
            }
          }
          let tempIndex = index;
          while (tempIndex + 1 < tempNodes.length - 1) {
            if (tempNodes[tempIndex + 1]["multitype"] === "single") {
              tempEdges.push({
                id: "l1-" + edgesIndex,
                source: String(index + 1),
                target: String(tempIndex + 2),
                type: "right",
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 5,
                  height: 5,
                  color: "#000000",
                },
                style: { strokeWidth: strokeWidth, stroke: "#000000" }, // ここで線の太さを設定
              });
              edgesIndex += 1;
              break;
            }
            tempIndex += 1;
          }

        }
      }
    });
    setEdges(tempEdges);
    setText(text);
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {/* 右側のセクション */}
          <div>
            <button
              style={{
                backgroundColor: "#65BBE9" /* 緑色 */,
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={downloadScreenshot}
            >
              ダウンロード
            </button>
            <button
              style={{
                backgroundColor: "#7D7D7D",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("{タイトル}")}
            >
              見出し
            </button>
          </div>
          <div>
            <button
              style={{
                backgroundColor: "#FFFFFF",
                color: "black",
                padding: "10px 15px",
                margin: "5px",
                border: "double",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(intro)")}
            >
              小さく
            </button>
            <button
              style={{
                backgroundColor: "#FFFFFF",
                color: "black",
                padding: "10px 15px",
                margin: "5px",
                border: "double",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(sup)")}
            >
              普通
            </button>
            <button
              style={{
                backgroundColor: "#FFFFFF",
                color: "black",
                padding: "10px 15px",
                margin: "5px",
                border: "double",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(main)")}
            >
              大きく
            </button>
          </div>
          <div>
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(title:タイトル)")}
            >
              タイトル
            </button>
        
          </div>
          <div>
            <button
              style={{
                backgroundColor: "#f79428",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(multi)")}
            >
              複数
            </button>
            <button
              style={{
                backgroundColor: "#f79428",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(vs)")}
            >
              VS
            </button>
            <button
              style={{
                backgroundColor: "#f79428",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(line)")}
            >
              矢印
            </button>
            <button
              style={{
                backgroundColor: "#f79428",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => handleinsertClick("(non)")}
            >
              線なし
            </button>
          </div>
          <div>
            枠線：
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                border = "solid 1px #000"
                changeText(text)
              }}
            >
              1px
            </button>
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                border = "solid 1.5px #000"
                changeText(text)
            }}
            >
              1.5px
            </button>
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                border = "solid 2px #000"
                changeText(text)
            }}
            >
              2px
            </button>
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                border = "solid 3px #000"
                changeText(text)
              }}
            >
              3px
            </button>
          </div>
          <div>
            矢印：
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                strokeWidth = 2
                changeText(text)
              }}
            >
              細く
            </button>
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                strokeWidth = 4
                changeText(text)
            }}
            >
              普通
            </button>
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                strokeWidth = 6
                changeText(text)
              }}
            >
              太く
            </button>
          </div>
          <div>
            間隔；
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                heightMargin = 20
                changeText(text)
              }}
            >
              狭く
            </button>
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                heightMargin = 40
                changeText(text)
            }}
            >
              普通
            </button>
            <button
              style={{
                backgroundColor: "#9d5b8b",
                color: "white",
                padding: "10px 15px",
                margin: "5px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                heightMargin = 60
                changeText(text)
              }}
            >
              広く
            </button>
          </div>
          <textarea
            ref={textAreaRef}
            value={text}
            rows={100}
            cols={50}
            style={{
              width: "90%" /* サイズは必要に応じて調整 */,
              height: "450px" /* サイズは必要に応じて調整 */,
              padding: "12px 20px",
              boxSizing: "border-box",
              border: "2px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f8f8f8",
              resize: "none",
            }}
            onChange={(v) => {
              changeText(v.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
