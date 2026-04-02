'use client';

import {useState, useMemo, useCallback} from 'react';
import {useModel} from '../../../context/ModelContext';
import {
  HeadingXS,
  HeadingXSFooter,
  ParagraphAlt,
  Button,
} from '../../uiComponents';

function MeshViewer() {
  const {modelData, setModelData} = useModel();
  const [filter, setFilter] = useState('');
  const [showVisibleOnly, setShowVisibleOnly] = useState(false);

  const meshes = useMemo(() => {
    if (!modelData?.meshes) return [];

    return Object.entries(modelData.meshes)
      .map(([name, mesh]) => ({
        name,
        ...mesh,
        isVisible: mesh.object?.visible !== false,
      }))
      .filter((mesh) => {
        const matchesFilter = mesh.name.toLowerCase().includes(filter.toLowerCase());
        return matchesFilter && (showVisibleOnly ? mesh.isVisible : true);
      });
  }, [modelData?.meshes, filter, showVisibleOnly]);

  const totalCount = modelData?.meshes ? Object.keys(modelData.meshes).length : 0;
  const visibleCount = useMemo(() => {
    if (!modelData?.meshes) return 0;
    return Object.values(modelData.meshes).filter((m) => m.object?.visible !== false).length;
  }, [modelData?.meshes]);

  const toggleVisibility = useCallback((meshName) => {
    const mesh = modelData?.meshes?.[meshName];
    if (mesh?.object) {
      mesh.object.visible = !mesh.object.visible;
      setModelData((prev) => ({...prev}));
    }
  }, [modelData?.meshes, setModelData]);

  const toggleAll = useCallback((visible) => {
    if (!modelData?.meshes) return;
    Object.values(modelData.meshes).forEach((mesh) => {
      if (mesh?.object) mesh.object.visible = visible;
    });
    setModelData((prev) => ({...prev}));
  }, [modelData?.meshes, setModelData]);

  const copyMeshData = useCallback(() => {
    const data = meshes.map((m) => ({name: m.name, visible: m.isVisible, parent: m.parent}));
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }, [meshes]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-300">
      <div className="flex justify-between items-center">
        <HeadingXS className="text-gray-500">
          Meshes ({visibleCount}/{totalCount})
        </HeadingXS>
        <Button onClick={copyMeshData} variant="secondary" className="!text-[10px] !px-2 !py-1">
          Copy JSON
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search meshes..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-3 py-2 w-full text-xs bg-white rounded-lg border border-gray-300 focus:border-brandPrimary focus:outline-none text-black placeholder-gray-400"
      />

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="checkbox" checked={showVisibleOnly} onChange={(e) => setShowVisibleOnly(e.target.checked)} className="w-3 h-3 accent-brandPrimary" />
          <HeadingXSFooter className="text-gray-500">Visible only</HeadingXSFooter>
        </label>
        <button onClick={() => toggleAll(true)} className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded border border-green-200 hover:bg-green-200 uppercase tracking-wider">
          Show All
        </button>
        <button onClick={() => toggleAll(false)} className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded border border-red-200 hover:bg-red-200 uppercase tracking-wider">
          Hide All
        </button>
      </div>

      <div className="overflow-y-auto max-h-[50vh] space-y-1">
        {meshes.map((mesh) => (
          <div
            key={mesh.name}
            className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${
              mesh.isVisible ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200 opacity-60'
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer min-w-0 flex-1">
              <input
                type="checkbox"
                checked={mesh.isVisible}
                onChange={() => toggleVisibility(mesh.name)}
                className="w-3 h-3 accent-brandPrimary"
              />
              <ParagraphAlt className="truncate text-black">{mesh.name}</ParagraphAlt>
            </label>
            {mesh.parent && (
              <HeadingXSFooter className="text-gray-400 truncate ml-2 max-w-[80px]">
                {mesh.parent}
              </HeadingXSFooter>
            )}
          </div>
        ))}
        {meshes.length === 0 && (
          <p className="text-center text-gray-400 py-4 text-xs">
            {filter ? 'No meshes match your search' : 'No meshes found'}
          </p>
        )}
      </div>
    </div>
  );
}

export default MeshViewer;
