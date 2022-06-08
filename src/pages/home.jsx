import React, { useState, useEffect } from "react";
import { getFromStorage, saveToStorage } from "../services/storageService";
import TreeView from "../components/treeView/treeView";

const Home = () => {
  const [data, setData] = useState([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    const treeData = getFromStorage("treeData");
    if (treeData) {
      setData(treeData);
    }
  }, [shouldUpdate]);

  const updateData = (data) => {
    saveToStorage("treeData", data);
    setData(data);
    setShouldUpdate(!shouldUpdate);
  };

  return (
    <div>
      <TreeView
        mydata={data ? data : []}
        onSaveData={(data) => {
          updateData(data);
        }}
      />
    </div>
  );
};

export default Home;
