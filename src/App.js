import React, { useEffect, createRef, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import * as htmlToImage from "html-to-image";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
  { id: "3", position: { x: 200, y: 100 }, data: { label: "3" } },
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const ref = createRef(null);

  const takeScreenShot = async (node) => {
    const dataURI = await htmlToImage.toJpeg(node);
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
    let edgesArray = [];
    let nodeesArray = [];
    lines.forEach((line, index) => {
      if (line.includes("->")) {
        edgesArray.push(line);
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
    edgesArray.forEach((edge, index) => {
      let array = edge.split("->");
      tempEdges.push({ id: "e1-" + index, source: array[0], target: array[1] });
    });
    setEdges(tempEdges);
    if (tempEdges.length === 0) {
      setNodes(tempNodes);
      return;
    }
    nodeesArray.forEach((node, index) => {
      let tempindex = index + 1;

      let height = 0;
      while (true) {
        let breakflg;
        console.log("For");
        for (let i = 0; i < tempEdges.length; i++) {
          breakflg = false;
          if (tempEdges[i].target === String(tempindex)) {
            height += 1;
            if (tempEdges[i].source === "1") {
              breakflg = true;
            } else {
              console.log("tempindex = tempEdges[i].source;");
              tempindex = tempEdges[i].source;
              break;
            }
          } else {
            breakflg = true;
          }
        }
        console.log("SSSS");
        if (breakflg) {
          break;
        }
      }
      let width = 0;
      tempNodes.forEach((node) => {
        if (node.position.y === height * 100) {
          width += 1;
        }
      });

      tempNodes.push({
        id: String(index + 1),
        position: { x: width * 200, y: height * 100 },
        data: { label: node.data.label },
      });
    });
    console.log("tempNodes");
    console.log(tempNodes);
    setNodes(tempNodes);
  };

  return (
    <>
      <div ref={ref} style={{ width: "80vw", height: "60vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
        />
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
