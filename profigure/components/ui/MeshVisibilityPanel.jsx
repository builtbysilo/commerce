"use client";

import {useState, useEffect} from "react";
import {useModel} from "../../context/ModelContext";

export function MeshVisibilityPanel() {
  const {modelData, setModelData} = useModel();
  const [meshVisibility, setMeshVisibility] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);

  // Get mesh names
  const meshNames = modelData?.meshes
    ? Object.keys(modelData.meshes).sort()
    : [];

  // Filter meshes based on search
  const filteredMeshes = meshNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize visibility state
  useEffect(() => {
    if (meshNames.length > 0) {
      const initialVisibility = {};
      meshNames.forEach((name) => {
        initialVisibility[name] =
          modelData.meshes[name]?.object?.visible !== false;
      });
      setMeshVisibility(initialVisibility);
    }
  }, [meshNames.length]);

  // Handle visibility toggle
  const handleVisibilityToggle = (meshName, isVisible) => {
    const mesh = modelData?.meshes?.[meshName];
    if (mesh?.object) {
      mesh.object.visible = isVisible;
      setMeshVisibility((prev) => ({...prev, [meshName]: isVisible}));
    }
  };

  // Toggle all meshes
  const toggleAll = (visible) => {
    setShowAll(visible);
    meshNames.forEach((meshName) => {
      handleVisibilityToggle(meshName, visible);
    });
  };

  // Copy mesh data as JSON
  const copyMeshJSON = async () => {
    const meshData = {
      meshCount: meshNames.length,
      meshes: meshNames.map((name) => ({
        name,
        visible: meshVisibility[name] !== false,
        type: modelData.meshes[name]?.type || "Mesh",
        parent: modelData.meshes[name]?.parent || null,
        material: modelData.meshes[name]?.material || "Unknown",
        geometry: modelData.meshes[name]?.geometry || "Unknown",
      })),
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(meshData, null, 2));
      console.log("Mesh data copied to clipboard");
    } catch (err) {
      console.error("Failed to copy mesh data:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = JSON.stringify(meshData, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  // Refresh mesh data
  const refreshMeshData = () => {
    console.log("Refreshing mesh data...");

    // Try to extract meshes from nodes if needed
    if (
      modelData?.nodes &&
      (!modelData.meshes || Object.keys(modelData.meshes).length === 0)
    ) {
      const extractedMeshes = {};

      Object.entries(modelData.nodes).forEach(([nodeName, node]) => {
        if (node && node.isMesh) {
          extractedMeshes[nodeName] = {
            name: nodeName,
            type: node.type || "Mesh",
            object: node,
            parent: node.parent?.name || null,
            material: node.material?.name || "Unknown",
            geometry: node.geometry?.type || "Unknown",
            visible: node.visible !== false,
          };
        }
      });

      if (Object.keys(extractedMeshes).length > 0) {
        setModelData((prevData) => ({
          ...prevData,
          meshes: extractedMeshes,
        }));
      }
    }
  };

  return (
    <div className="mesh-visibility-panel">
      <div className="panel-header">
        <h3>Mesh Visibility</h3>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "▶" : "▼"}
        </button>
      </div>

      {!isCollapsed && (
        <div className="panel-content">
          <div className="panel-controls">
            <div className="mesh-count">{meshNames.length} meshes found</div>
            <div className="panel-buttons">
              <button
                className="refresh-btn"
                onClick={refreshMeshData}
                title="Refresh mesh list"
              >
                🔄 Refresh
              </button>
              <button
                className="copy-json-btn"
                onClick={copyMeshJSON}
                title="Copy mesh data as JSON"
              >
                📋 Copy JSON
              </button>
            </div>
          </div>

          {meshNames.length > 0 && (
            <>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search meshes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="toggle-all">
                <button onClick={() => toggleAll(true)}>Show All</button>
                <button onClick={() => toggleAll(false)}>Hide All</button>
              </div>

              <div className="mesh-list">
                {filteredMeshes.slice(0, 100).map((meshName) => (
                  <div key={meshName} className="mesh-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={meshVisibility[meshName] !== false}
                        onChange={(e) =>
                          handleVisibilityToggle(meshName, e.target.checked)
                        }
                      />
                      <span className="mesh-name">{meshName}</span>
                    </label>
                  </div>
                ))}
                {filteredMeshes.length > 100 && (
                  <div className="more-meshes">
                    ... and {filteredMeshes.length - 100} more
                  </div>
                )}
              </div>
            </>
          )}

          {meshNames.length === 0 && (
            <div className="no-meshes">
              No meshes loaded. Click refresh or load a model.
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .mesh-visibility-panel {
          position: fixed;
          top: 80px;
          right: 20px;
          width: 300px;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          z-index: 1000;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .collapse-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 12px;
          padding: 4px 8px;
        }

        .panel-content {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mesh-count {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }

        .panel-buttons {
          display: flex;
          gap: 8px;
        }

        .refresh-btn,
        .copy-json-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .refresh-btn:hover,
        .copy-json-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .search-box {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-box input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 13px;
        }

        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .toggle-all {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .toggle-all button {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .toggle-all button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .mesh-list {
          overflow-y: auto;
          max-height: 400px;
          padding: 8px 0;
        }

        .mesh-item {
          padding: 4px 16px;
          transition: background 0.2s;
        }

        .mesh-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .mesh-item label {
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 8px;
        }

        .mesh-item input[type="checkbox"] {
          cursor: pointer;
        }

        .mesh-name {
          font-size: 13px;
          word-break: break-word;
        }

        .more-meshes {
          padding: 12px 16px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          text-align: center;
        }

        .no-meshes {
          padding: 24px 16px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        /* Scrollbar styling */
        .mesh-list::-webkit-scrollbar {
          width: 6px;
        }

        .mesh-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .mesh-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .mesh-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
