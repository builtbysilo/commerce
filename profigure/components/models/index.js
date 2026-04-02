// Core engine
export {default as ModelLoader} from './core/ModelLoader';
export {default as ModelRenderer} from './core/ModelRenderer';
export {processScene, discoverMeshes, applyMaterials, findMeshesUnder} from './core/MeshProcessor';

// Model configs — import directly from model files
export {default as macbookConfig} from './macbook/MacBook.profig';
export {default as kbirdConfig} from './kbird/KBird.profig';
export {default as KBird} from './kbird/KBird';
export {default as profigureConfig} from './profigure/Profigure.profig';
export {default as Profigure} from './profigure/Profigure';
