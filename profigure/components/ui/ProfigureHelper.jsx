import React, {useState, useMemo, useCallback, useRef} from "react";
import {useModel} from "../../context/ModelContext";
import {motion, AnimatePresence} from "motion/react";
import Image from "next/image";
import {
  HeadingLG,
  HeadingMD,
  HeadingSM,
  HeadingXS,
  HeadingXSFooter,
  Paragraph,
  ParagraphAlt,
  Button,
  ButtonLG,
} from "../uiComponents";

export function ProfigureHelper({
  sceneName = "Unknown Scene",
  selectedOptions = {},
  debugInfo = null,
  className = "",
}) {
  // Slider Configuration
  const POSITION_MIN = -5;
  const POSITION_MAX = 5;
  const ROTATION_MIN = 0;
  const ROTATION_MAX = 360;

  // Sensitivity/Strength Configuration
  const POSITION_STRENGTH = {
    x: 0.1, // Very sensitive, scale down significantly
    y: 0.3, // Very sensitive, scale down significantly
    z: 1.0, // Z-axis is fine at normal strength
  };

  const {
    modelData,
    setModelData,
    modelPosition,
    modelRotation,
    setModelPosition,
    setModelRotation,
  } = useModel();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [meshFilter, setMeshFilter] = useState("");
  const [showVisibleOnly, setShowVisibleOnly] = useState(false);

  // Transform Controls State
  const [useContextValues, setUseContextValues] = useState(true);
  const [manualPosition, setManualPosition] = useState({x: 0, y: 0, z: 4});
  const [manualRotation, setManualRotation] = useState({x: 0, y: 0, z: 0});

  // Slider-specific state for smooth updates
  const [sliderPosition, setSliderPosition] = useState({x: 0, y: 0, z: 4});
  const [sliderRotation, setSliderRotation] = useState({x: 0, y: 0, z: 0});

  // Mesh visibility state for controls
  const [meshVisibilityState, setMeshVisibilityState] = useState({});

  // Debounce refs for slider updates
  const positionTimeoutRef = useRef({});
  const rotationTimeoutRef = useRef({});

  // Get current display values (what to show in the inputs)
  const displayPosition = useContextValues
    ? modelPosition || {x: 0, y: 0, z: 4}
    : manualPosition;
  const displayRotation = useContextValues
    ? modelRotation || {x: 0, y: 0, z: 0}
    : manualRotation;

  // Slider display values (for smooth slider interaction)
  // Scale position values for slider display (divide by strength for slider range)
  const sliderDisplayPosition = useContextValues
    ? {
        x: (modelPosition?.x || 0) / POSITION_STRENGTH.x,
        y: (modelPosition?.y || 0) / POSITION_STRENGTH.y,
        z: (modelPosition?.z || 4) / POSITION_STRENGTH.z,
      }
    : {
        x: sliderPosition.x / POSITION_STRENGTH.x,
        y: sliderPosition.y / POSITION_STRENGTH.y,
        z: sliderPosition.z / POSITION_STRENGTH.z,
      };
  const sliderDisplayRotation = useContextValues
    ? modelRotation || {x: 0, y: 0, z: 0}
    : sliderRotation;

  // Initialize manual values with context values on first load
  React.useEffect(() => {
    if (modelPosition && modelRotation) {
      setManualPosition(modelPosition);
      setManualRotation(modelRotation);
      setSliderPosition(modelPosition);
      setSliderRotation(modelRotation);
    }
  }, [modelPosition, modelRotation]);

  // Sync slider states with manual states
  React.useEffect(() => {
    setSliderPosition(manualPosition);
    setSliderRotation(manualRotation);
  }, [manualPosition, manualRotation]);

  // When switching to manual mode, apply manual values to context immediately
  React.useEffect(() => {
    if (!useContextValues && setModelPosition && setModelRotation) {
      setModelPosition(manualPosition);
      setModelRotation(manualRotation);
    }
  }, [
    useContextValues,
    manualPosition,
    manualRotation,
    setModelPosition,
    setModelRotation,
  ]);

  // Mesh data processing
  const meshData = useMemo(() => {
    if (!modelData?.meshes) return {meshes: [], count: 0, visible: 0};

    const meshes = Object.entries(modelData.meshes).map(([name, mesh]) => ({
      name,
      ...mesh,
      isVisible: mesh.object?.visible !== false,
    }));

    const filtered = meshes.filter((mesh) => {
      const matchesFilter = mesh.name
        .toLowerCase()
        .includes(meshFilter.toLowerCase());
      const matchesVisibility = showVisibleOnly ? mesh.isVisible : true;
      return matchesFilter && matchesVisibility;
    });

    return {
      meshes: filtered,
      allMeshes: meshes,
      count: meshes.length,
      visible: meshes.filter((m) => m.isVisible).length,
      hidden: meshes.filter((m) => !m.isVisible).length,
    };
  }, [modelData?.meshes, meshFilter, showVisibleOnly]);

  // Update mesh visibility state when meshes change
  React.useEffect(() => {
    if (meshData?.allMeshes?.length > 0) {
      const newVisibilityState = {};
      meshData.allMeshes.forEach((mesh) => {
        newVisibilityState[mesh.name] = mesh.isVisible;
      });
      setMeshVisibilityState(newVisibilityState);
    }
  }, [meshData?.allMeshes?.length]);

  // Toggle mesh visibility
  const toggleMeshVisibility = useCallback(
    (meshName) => {
      const mesh = modelData?.meshes?.[meshName];
      if (mesh?.object) {
        const newVisibility = !mesh.object.visible;
        mesh.object.visible = newVisibility;
        setMeshVisibilityState((prev) => ({
          ...prev,
          [meshName]: newVisibility,
        }));
      }
    },
    [modelData?.meshes]
  );

  // Show/Hide all meshes
  const toggleAllMeshes = useCallback(
    (visible) => {
      if (!modelData?.meshes) return;

      Object.entries(modelData.meshes).forEach(([name, mesh]) => {
        if (mesh?.object) {
          mesh.object.visible = visible;
        }
      });

      // Update all mesh visibility states
      const newVisibilityState = {};
      Object.keys(modelData.meshes).forEach((name) => {
        newVisibilityState[name] = visible;
      });
      setMeshVisibilityState(newVisibilityState);
    },
    [modelData?.meshes]
  );

  // Copy transform values to clipboard
  const copyTransformValues = useCallback(() => {
    const positionText = `position: {x: ${displayPosition.x}, y: ${displayPosition.y}, z: ${displayPosition.z}}`;
    const rotationText = `rotation: {x: ${displayRotation.x}, y: ${displayRotation.y}, z: ${displayRotation.z}}`;
    const transformText = `        ${positionText},\n        ${rotationText},`;

    navigator.clipboard
      .writeText(transformText)
      .then(() => {
        console.log("🎯 Transform values copied to clipboard:", transformText);
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
  }, [displayPosition, displayRotation]);

  // Debounced update function for sliders
  const updateSliderDebounced = useCallback(
    (type, axis, value) => {
      const numValue = parseFloat(value) || 0;

      // Only allow updates when NOT using context values (manual mode)
      if (!useContextValues) {
        // Clear existing timeout for this axis
        const timeoutRef =
          type === "position" ? positionTimeoutRef : rotationTimeoutRef;
        if (timeoutRef.current[axis]) {
          clearTimeout(timeoutRef.current[axis]);
        }

        // Update slider state immediately for smooth UI
        if (type === "position") {
          // Apply strength multiplier for actual position value
          const actualValue = numValue * POSITION_STRENGTH[axis];
          setSliderPosition((prev) => ({
            ...prev,
            [axis]: actualValue,
          }));
        } else if (type === "rotation") {
          setSliderRotation((prev) => ({
            ...prev,
            [axis]: numValue,
          }));
        }

        // Debounce the actual state update
        timeoutRef.current[axis] = setTimeout(() => {
          if (type === "position") {
            const actualValue = numValue * POSITION_STRENGTH[axis];
            setManualPosition((prev) => ({
              ...prev,
              [axis]: actualValue,
            }));
          } else if (type === "rotation") {
            setManualRotation((prev) => ({
              ...prev,
              [axis]: numValue,
            }));
          }
        }, 16); // ~60fps for smooth updates
      }
    },
    [useContextValues, POSITION_STRENGTH]
  );

  // Update transform values (for number inputs)
  const updateTransform = useCallback(
    (type, axis, value) => {
      const numValue = parseFloat(value) || 0;

      // Only allow updates when NOT using context values (manual mode)
      if (!useContextValues) {
        if (type === "position") {
          setManualPosition((prev) => ({
            ...prev,
            [axis]: numValue,
          }));
        } else if (type === "rotation") {
          setManualRotation((prev) => ({
            ...prev,
            [axis]: numValue,
          }));
        }
      }
      // When useContextValues is true, the inputs should be read-only
      // The context values are updated by settings/options selections
    },
    [useContextValues]
  );

  // Toggle context values mode
  const toggleContextValues = useCallback(
    (enabled) => {
      setUseContextValues(enabled);
      if (!enabled) {
        // When switching to manual mode, sync manual values with current context
        if (modelPosition && modelRotation) {
          setManualPosition(modelPosition);
          setManualRotation(modelRotation);
        }
      }
      // When switching to context mode, just show context values
      // The useEffect will handle applying manual values if needed
    },
    [modelPosition, modelRotation]
  );

  // Copy JSON functions
  const copyMeshData = useCallback(() => {
    const data = {
      sceneName,
      meshCount: meshData.count,
      meshes: meshData.allMeshes.map((m) => ({
        name: m.name,
        visible: m.isVisible,
        parent: m.parent,
        type: m.type,
      })),
    };

    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    console.log("📋 Mesh data copied to clipboard");
  }, [sceneName, meshData]);

  const copySelectedOptions = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(selectedOptions, null, 2));
    console.log("📋 Selected options copied to clipboard");
  }, [selectedOptions]);

  // Refresh mesh data
  const refreshMeshData = useCallback(() => {
    console.log("🔄 Manual refresh triggered");
    if (modelData?.nodes && !modelData.meshes) {
      console.log("Re-processing nodes for mesh data");
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
        console.log(
          "✅ Extracted meshes from nodes:",
          Object.keys(extractedMeshes).length
        );
        setModelData((prevData) => ({
          ...prevData,
          meshes: extractedMeshes,
        }));
      }
    }
  }, [modelData, setModelData]);

  // Keyboard shortcut to toggle
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "`" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      // Clear all position timeouts
      Object.values(positionTimeoutRef.current).forEach(clearTimeout);
      // Clear all rotation timeouts
      Object.values(rotationTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  if (process.env.NODE_ENV === "production") {
    return null; // Hide in production
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 p-3 text-white bg-gray-50 rounded-full shadow-lg transition-all duration-200 z-[9999] hover:bg-gray-200 ${className}`}
        title="Toggle Profigure Helper (Cmd/Ctrl + `)"
      >
        <Image
          src="/ProfigureIcon.svg"
          alt="Profigure Helper"
          width={20}
          height={20}
        />
      </button>

      {/* Helper Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, x: 400}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 400}}
            className="fixed top-0 right-0 h-full w-96 bg-gray-900 text-white shadow-2xl z-[9998] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <HeadingMD className="text-indigo-400">
                  Profigure Helper
                </HeadingMD>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Scene Info */}
              <div className="mt-2">
                <ParagraphAlt className="text-gray-300">
                  Scene: <span className="text-indigo-300">{sceneName}</span>
                </ParagraphAlt>
                <ParagraphAlt className="text-gray-300">
                  Meshes:{" "}
                  <span className="text-green-400">{meshData.visible}</span>/
                  <span className="text-gray-400">{meshData.count}</span>
                </ParagraphAlt>
                {debugInfo && (
                  <ParagraphAlt className="text-gray-300">
                    Sections:{" "}
                    <span className="text-blue-400">
                      {debugInfo.sectionsCount}
                    </span>
                  </ParagraphAlt>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-800 border-b border-gray-700">
              {[
                {key: "overview", label: "Overview", icon: "📊"},
                {key: "controls", label: "Controls", icon: "🎮"},
                {key: "meshes", label: "Meshes", icon: "🔍"},
                {key: "options", label: "Options", icon: "⚙️"},
                {key: "debug", label: "Debug", icon: "🐛"},
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 p-2 transition-colors ${
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-sm">{tab.icon}</span>
                    <HeadingXSFooter className="text-inherit">
                      {tab.label}
                    </HeadingXSFooter>
                  </div>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-4">
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded">
                    <HeadingSM className="mb-2 text-indigo-400">
                      Model Status
                    </HeadingSM>
                    <div className="space-y-1">
                      <ParagraphAlt className="text-gray-300">
                        Total Meshes:{" "}
                        <span className="text-white">{meshData.count}</span>
                      </ParagraphAlt>
                      <ParagraphAlt className="text-gray-300">
                        Visible:{" "}
                        <span className="text-green-400">
                          {meshData.visible}
                        </span>
                      </ParagraphAlt>
                      <ParagraphAlt className="text-gray-300">
                        Hidden:{" "}
                        <span className="text-red-400">{meshData.hidden}</span>
                      </ParagraphAlt>
                      <ParagraphAlt className="text-gray-300">
                        Loaded: <span className="text-green-400">✅</span>
                      </ParagraphAlt>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-800 rounded">
                    <HeadingSM className="mb-2 text-indigo-400">
                      Quick Actions
                    </HeadingSM>
                    <div className="space-y-2">
                      <Button
                        onClick={() => toggleAllMeshes(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600"
                      >
                        Show All Meshes
                      </Button>
                      <Button
                        onClick={() => toggleAllMeshes(false)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600"
                      >
                        Hide All Meshes
                      </Button>
                    </div>
                  </div>

                  {debugInfo && (
                    <div className="p-3 bg-gray-800 rounded">
                      <HeadingSM className="mb-2 text-indigo-400">
                        Scene Info
                      </HeadingSM>
                      <div className="space-y-1">
                        <ParagraphAlt className="text-gray-300">
                          Sections:{" "}
                          <span className="text-white">
                            {debugInfo.sectionsCount}
                          </span>
                        </ParagraphAlt>
                        <ParagraphAlt className="text-gray-300">
                          Total Options:{" "}
                          <span className="text-white">
                            {debugInfo.totalOptions}
                          </span>
                        </ParagraphAlt>
                        <ParagraphAlt className="text-gray-300">
                          Expected Meshes:{" "}
                          <span className="text-white">
                            {debugInfo.expectedMeshes?.length || 0}
                          </span>
                        </ParagraphAlt>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "controls" && (
                <div className="space-y-4">
                  {/* Transform Controls */}
                  <div className="p-3 bg-gray-800 rounded">
                    <div className="flex justify-between items-center mb-3">
                      <HeadingSM className="text-indigo-400">
                        Transform
                      </HeadingSM>
                      <Button
                        onClick={copyTransformValues}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                      >
                        📋 Copy
                      </Button>
                    </div>

                    {/* Position Controls */}
                    <div className="mb-4">
                      <HeadingXS className="mb-2 text-gray-300">
                        Position
                      </HeadingXS>
                      <div className="grid grid-cols-3 gap-2">
                        {["x", "y", "z"].map((axis) => (
                          <div key={axis} className="space-y-1">
                            <HeadingXSFooter className="text-gray-400">
                              {axis.toUpperCase()}
                            </HeadingXSFooter>
                            <input
                              type="number"
                              step="0.005"
                              value={displayPosition[axis]}
                              onChange={(e) =>
                                updateTransform(
                                  "position",
                                  axis,
                                  e.target.value
                                )
                              }
                              disabled={useContextValues}
                              className={`w-full border rounded px-2 py-1 text-white text-sm focus:outline-none ${
                                useContextValues
                                  ? "bg-gray-600 border-gray-500 cursor-not-allowed"
                                  : "bg-gray-700 border-gray-600 focus:border-indigo-500"
                              }`}
                            />
                            <input
                              type="range"
                              min={POSITION_MIN}
                              max={POSITION_MAX}
                              step="0.01"
                              value={sliderDisplayPosition[axis]}
                              onChange={(e) =>
                                updateSliderDebounced(
                                  "position",
                                  axis,
                                  e.target.value
                                )
                              }
                              disabled={useContextValues}
                              className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${
                                useContextValues
                                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                                  : "bg-gray-700"
                              } slider`}
                              style={{
                                background: useContextValues
                                  ? "#4b5563"
                                  : `linear-gradient(to right, #374151 0%, #6366f1 ${
                                      ((sliderDisplayPosition[axis] -
                                        POSITION_MIN) /
                                        (POSITION_MAX - POSITION_MIN)) *
                                      100
                                    }%, #374151 ${
                                      ((sliderDisplayPosition[axis] -
                                        POSITION_MIN) /
                                        (POSITION_MAX - POSITION_MIN)) *
                                      100
                                    }%)`,
                              }}
                            />
                            <div className="flex justify-between">
                              <HeadingXSFooter className="text-gray-500">
                                {POSITION_MIN}
                              </HeadingXSFooter>
                              <HeadingXSFooter className="text-gray-500">
                                {POSITION_MAX}
                              </HeadingXSFooter>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rotation Controls */}
                    <div className="mb-4">
                      <HeadingXS className="mb-2 text-gray-300">
                        Rotation
                      </HeadingXS>
                      <div className="grid grid-cols-3 gap-2">
                        {["x", "y", "z"].map((axis) => (
                          <div key={axis} className="space-y-1">
                            <HeadingXSFooter className="text-gray-400">
                              {axis.toUpperCase()}
                            </HeadingXSFooter>
                            <input
                              type="number"
                              step="1"
                              value={displayRotation[axis]}
                              onChange={(e) =>
                                updateTransform(
                                  "rotation",
                                  axis,
                                  e.target.value
                                )
                              }
                              disabled={useContextValues}
                              className={`w-full border rounded px-2 py-1 text-white text-sm focus:outline-none ${
                                useContextValues
                                  ? "bg-gray-600 border-gray-500 cursor-not-allowed"
                                  : "bg-gray-700 border-gray-600 focus:border-indigo-500"
                              }`}
                            />
                            <input
                              type="range"
                              min={ROTATION_MIN}
                              max={ROTATION_MAX}
                              step="1"
                              value={sliderDisplayRotation[axis]}
                              onChange={(e) =>
                                updateSliderDebounced(
                                  "rotation",
                                  axis,
                                  e.target.value
                                )
                              }
                              disabled={useContextValues}
                              className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${
                                useContextValues
                                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                                  : "bg-gray-700"
                              } slider`}
                              style={{
                                background: useContextValues
                                  ? "#4b5563"
                                  : `linear-gradient(to right, #374151 0%, #f59e0b ${
                                      ((sliderDisplayRotation[axis] -
                                        ROTATION_MIN) /
                                        (ROTATION_MAX - ROTATION_MIN)) *
                                      100
                                    }%, #374151 ${
                                      ((sliderDisplayRotation[axis] -
                                        ROTATION_MIN) /
                                        (ROTATION_MAX - ROTATION_MIN)) *
                                      100
                                    }%)`,
                              }}
                            />
                            <div className="flex justify-between">
                              <HeadingXSFooter className="text-gray-500">
                                {ROTATION_MIN}°
                              </HeadingXSFooter>
                              <HeadingXSFooter className="text-gray-500">
                                {ROTATION_MAX}°
                              </HeadingXSFooter>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Context Values Toggle */}
                    <div className="mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={useContextValues}
                          onChange={(e) =>
                            toggleContextValues(e.target.checked)
                          }
                          className="mr-2"
                        />
                        <ParagraphAlt className="text-gray-300">
                          Use Context Values
                        </ParagraphAlt>
                      </label>
                      <ParagraphAlt className="mt-1 text-gray-400">
                        {useContextValues
                          ? "📖 Read-only: Showing values from scene settings/options"
                          : "✏️ Manual mode: Real-time camera control for development"}
                      </ParagraphAlt>
                    </div>
                  </div>

                  {/* Mesh Controls */}
                  <div className="p-3 bg-gray-800 rounded">
                    <div className="flex justify-between items-center mb-3">
                      <HeadingSM className="text-indigo-400">
                        Mesh Controls ({meshData.count})
                      </HeadingSM>
                      <Button
                        onClick={refreshMeshData}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      >
                        🔄 Refresh
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Button
                        onClick={() => toggleAllMeshes(true)}
                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                      >
                        Show All
                      </Button>
                      <Button
                        onClick={() => toggleAllMeshes(false)}
                        className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                      >
                        Hide All
                      </Button>
                    </div>

                    {/* Mesh Visibility Controls */}
                    <div className="overflow-y-auto space-y-1 max-h-64">
                      {meshData.allMeshes.slice(0, 30).map((mesh) => (
                        <div
                          key={mesh.name}
                          className="flex justify-between items-center p-1 bg-gray-700 rounded"
                        >
                          <label className="flex flex-1 items-center space-x-2 min-w-0 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={meshVisibilityState[mesh.name] !== false}
                              onChange={() => toggleMeshVisibility(mesh.name)}
                              className="w-3 h-3"
                            />
                            <ParagraphAlt className="text-white truncate">
                              {mesh.name}
                            </ParagraphAlt>
                          </label>
                        </div>
                      ))}
                    </div>

                    {meshData.count > 30 && (
                      <div className="mt-2 text-center">
                        <ParagraphAlt className="text-gray-400">
                          ... and {meshData.count - 30} more meshes
                        </ParagraphAlt>
                      </div>
                    )}

                    {meshData.count === 0 && (
                      <div className="py-4 text-center">
                        <Paragraph className="text-gray-400">
                          No meshes found. Try refreshing.
                        </Paragraph>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "meshes" && (
                <div className="space-y-4">
                  {/* Mesh Controls */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Search meshes..."
                      value={meshFilter}
                      onChange={(e) => setMeshFilter(e.target.value)}
                      className="px-3 py-2 w-full placeholder-gray-400 text-white bg-gray-800 rounded border border-gray-600 focus:border-indigo-500 focus:outline-none"
                    />

                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showVisibleOnly}
                          onChange={(e) => setShowVisibleOnly(e.target.checked)}
                          className="mr-2"
                        />
                        <ParagraphAlt className="text-gray-300">
                          Visible only
                        </ParagraphAlt>
                      </label>

                      <Button
                        onClick={copyMeshData}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                      >
                        📋 Copy JSON
                      </Button>
                    </div>
                  </div>

                  {/* Mesh List */}
                  <div className="overflow-y-auto space-y-1 max-h-96">
                    {meshData.meshes.map((mesh) => (
                      <div
                        key={mesh.name}
                        className={`flex items-center justify-between p-2 rounded ${
                          mesh.isVisible
                            ? "bg-gray-800"
                            : "bg-gray-700 opacity-60"
                        }`}
                      >
                        <div className="flex flex-1 items-center space-x-2 min-w-0">
                          <button
                            onClick={() => toggleMeshVisibility(mesh.name)}
                            className={`w-4 h-4 rounded border ${
                              mesh.isVisible
                                ? "bg-green-500 border-green-500"
                                : "bg-gray-600 border-gray-500"
                            }`}
                          >
                            {mesh.isVisible && (
                              <svg
                                className="mx-auto w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                          <ParagraphAlt className="text-white truncate">
                            {mesh.name}
                          </ParagraphAlt>
                        </div>

                        {mesh.parent && (
                          <HeadingXSFooter className="ml-2 text-gray-400 truncate max-w-16">
                            {mesh.parent}
                          </HeadingXSFooter>
                        )}
                      </div>
                    ))}
                  </div>

                  {meshData.meshes.length === 0 && (
                    <div className="py-8 text-center">
                      <Paragraph className="text-gray-400">
                        {meshFilter
                          ? "No meshes match your search"
                          : "No meshes found"}
                      </Paragraph>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "options" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <HeadingSM className="text-indigo-400">
                      Selected Options
                    </HeadingSM>
                    <Button
                      onClick={copySelectedOptions}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                    >
                      📋 Copy JSON
                    </Button>
                  </div>

                  <div className="p-3 bg-gray-800 rounded">
                    <pre className="overflow-x-auto text-gray-300 whitespace-pre-wrap">
                      <ParagraphAlt className="text-gray-300">
                        {JSON.stringify(selectedOptions, null, 2)}
                      </ParagraphAlt>
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === "debug" && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded">
                    <HeadingSM className="mb-2 text-indigo-400">
                      Debug Information
                    </HeadingSM>
                    <div className="space-y-2">
                      <div>
                        <HeadingXS className="text-gray-300">
                          Model Data:
                        </HeadingXS>
                        <pre className="mt-1 whitespace-pre-wrap">
                          <ParagraphAlt className="text-gray-300">
                            {JSON.stringify(
                              {
                                hasMeshes: !!modelData?.meshes,
                                meshCount: meshData.count,
                                hasNodeHierarchy: !!modelData?.nodeHierarchy,
                              },
                              null,
                              2
                            )}
                          </ParagraphAlt>
                        </pre>
                      </div>

                      {debugInfo && (
                        <div>
                          <HeadingXS className="text-gray-300">
                            Debug Info:
                          </HeadingXS>
                          <pre className="mt-1 whitespace-pre-wrap">
                            <ParagraphAlt className="text-gray-300">
                              {JSON.stringify(debugInfo, null, 2)}
                            </ParagraphAlt>
                          </pre>
                        </div>
                      )}

                      <div>
                        <HeadingXS className="text-gray-300">
                          Transform Values:
                        </HeadingXS>
                        <pre className="mt-1 whitespace-pre-wrap">
                          <ParagraphAlt className="text-gray-300">
                            {JSON.stringify(
                              {
                                useContextValues,
                                displayPosition,
                                displayRotation,
                                contextPosition: modelPosition,
                                contextRotation: modelRotation,
                                manualPosition,
                                manualRotation,
                              },
                              null,
                              2
                            )}
                          </ParagraphAlt>
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-800 rounded">
                    <HeadingSM className="mb-2 text-indigo-400">
                      Console Commands
                    </HeadingSM>
                    <div className="space-y-1">
                      <ParagraphAlt className="text-gray-300">
                        • <code>Cmd/Ctrl + `</code> - Toggle this panel
                      </ParagraphAlt>
                      <ParagraphAlt className="text-gray-300">
                        • Check browser console for detailed logs
                      </ParagraphAlt>
                      <ParagraphAlt className="text-gray-300">
                        • Use Copy JSON buttons to export data
                      </ParagraphAlt>
                      <ParagraphAlt className="text-gray-300">
                        • Transform values auto-update when changed
                      </ParagraphAlt>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
