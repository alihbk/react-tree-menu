import "./treeView.css";
import React, { useState, useEffect, useRef } from "react";

const TreeView = ({ mydata, onSaveData }) => {
  const [data, setData] = useState([]);
  const currentNode = useRef(null);

  useEffect(() => {
    setData(mydata);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mydata]);

  const handleKeyDown = (e) => {
    console.log("e.code", e.code);
    if (e.ctrlKey && e.shiftKey && e.code === "Delete") {
      e.preventDefault();
      onDelete();
    } else if (e.code === "Enter" || e.code === "NumpadAdd") {
      e.preventDefault();
      generateNode();
    }
  };

  let rootNode = {
    id: Date.now(),
    label: "any",
    children: [],
    editMode: true,
    isRoot: true,
    sort: 0,
  };
  let childNode = {
    id: Date.now(),
    label: "any",
    editMode: true,
    isRoot: false,
    sort: 0,
    parentId: 0,
  };

  const onCreateNode = () => {
    if (currentNode.current) {
      if (currentNode.current.isRoot) {
        let item = filterNodes(data, currentNode.current.id);
        console.log("item", item);

        childNode.parentId = currentNode.current.id;

        if (item && item.children && item.children.length > 0) {
          item.children.push(childNode);
        } else {
          item.children = [childNode];
        }
      } else {
      }
    } else {
      data.push(rootNode);
    }
  };

  const onDelete = () => {
    if (currentNode.current) {
      if (currentNode.current.isRoot) {
        let newData = data.filter((x) => x.id !== currentNode.current.id);

        onSaveData(newData);
        currentNode.current = null;
      } else {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === currentNode.current.parentId) {
            for (let j = 0; j < data[i].children.length; j++) {
              if (data[i].children[j].id === currentNode.current.id) {
                data[i].children.splice(j, 1);
              }
            }
          }
        }
        onSaveData(data);
        currentNode.current = null;
      }
    }
  };

  const onFinishEdit = () => {
    data.forEach((element) => {
      element.editMode = false;
      if (element.children) {
        element.children.forEach((c) => {
          c.editMode = false;
        });
      }
    });
    onSaveData(data);
  };

  const filterNodes = (nodes, id) => {
    return nodes && nodes.filter((y) => y.id === id)[0];
  };

  const onSelectNode = (node) => {
    currentNode.current = node;

    if (node.isRoot) {
      let root = filterNodes(data, node.id);

      onFinishEdit();

      root.editMode = true;
    } else {
      let root = filterNodes(data, node.parentId);

      onFinishEdit();

      let child = filterNodes(root.children, node.id);

      child.editMode = true;
    }

    onSaveData(data);
  };

  const renderInput = (node) => {
    return (
      <input
        type="text"
        value={node.label}
        onClick={() => {
          onSelectNode(node);
        }}
        onChange={(e) => {
          if (node.isRoot) {
            let root = filterNodes(data, node.id);
            root.label = e.target.value;
            onSaveData(data);
          } else {
            let root = filterNodes(data, node.parentId);
            let child = filterNodes(root.children, node.id);
            child.label = e.target.value;
            onSaveData(data);
          }
        }}
        onBlur={() => {
          onFinishEdit();
          currentNode.current = null;
        }}
        autofocus
      />
    );
  };

  const renderLabel = (node) => {
    return (
      <div
        onClick={() => {
          onSelectNode(node);
        }}
      >
        {node.label}
      </div>
    );
  };

  const generateNode = () => {
    onFinishEdit();

    onCreateNode();

    onSaveData(data);
  };

  const renderNodes = () => {
    return (
      <ul>
        {data &&
          data.map((rootNode, i) => {
            return (
              <li key={i}>
                {rootNode.editMode === true
                  ? renderInput(rootNode)
                  : renderLabel(rootNode)}

                {rootNode.children && (
                  <ul>
                    {rootNode.children.map((childNode, j) => {
                      return (
                        <li key={j}>
                          {childNode.editMode === true
                            ? renderInput(childNode)
                            : renderLabel(childNode)}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}

        <li
          className={"plusBtn"}
          onClick={() => {
            generateNode();
          }}
        >
          +
        </li>
      </ul>
    );
  };

  return <div className="main">{renderNodes()}</div>;
};

export default TreeView;
