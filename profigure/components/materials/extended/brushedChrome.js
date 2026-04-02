import chrome from '../presets/chrome';

const brushedChrome = {
  name: 'brushedChrome',
  extends: 'chrome',
  type: chrome.type,
  params: {...chrome.params, roughness: 0.3},
  textures: {...chrome.textures, normalMap: 'normal'},
  description: 'Chrome with brushed normal map texture',
};

export default brushedChrome;
