import {
  SelectionColor,
  SelectionSystem,
  SelectionAddOn,
} from '../../uiComponents';
import kbirdShopifyProducts from './kbird.shopify';

const kbirdSettings = {
  meta: {name: 'K-Bird', model: 'kbird', version: '1.0'},
  defaults: {lighting: 'studio', background: '#888C89', accentColor: '#ff6b00'},
  sections: [
    {
      title: 'Bundles',
      options: [
        {title: 'Designer', position: {x: 0, y: 0, z: 3.8}, rotation: {x: 46, y: 32, z: 0}},
        {title: 'Developer', position: {x: 0, y: 0, z: 3.8}, rotation: {x: 46, y: 32, z: 0}},
        {title: 'Editor', position: {x: 0, y: 0, z: 3.8}, rotation: {x: 46, y: 32, z: 0}},
        {title: 'Writer', position: {x: 0, y: 0, z: 3.8}, rotation: {x: 46, y: 32, z: 0}},
      ],
      grid: 'grid-cols-1',
      selection: 'secondary',
    },
    {
      title: 'System',
      options: [
        {title: 'Mac', position: {x: 0.03, y: 0.01, z: 4.23}, rotation: {x: 31, y: 30, z: 0}, component: <SelectionSystem img="/Mac.svg" />},
        {title: 'Windows', position: {x: 0.03, y: 0.01, z: 4.23}, rotation: {x: 31, y: 30, z: 0}, component: <SelectionSystem img="/Windows.svg" />},
      ],
      grid: 'grid-cols-2',
      selection: 'primary',
    },
    {
      title: 'Color',
      options: [
        {title: 'Orange', position: {x: 0, y: 0, z: 4.07}, rotation: {x: 90, y: 0, z: 0}, color: '#ff6b00', component: <SelectionColor option={{color: '#ff6b00'}} />},
        {title: 'Blue', position: {x: 0, y: 0, z: 4.07}, rotation: {x: 90, y: 0, z: 0}, color: '#3C61E5', component: <SelectionColor option={{color: '#3C61E5'}} />},
        {title: 'Green', position: {x: 0, y: 0, z: 4.07}, rotation: {x: 90, y: 0, z: 0}, color: '#19E341', component: <SelectionColor option={{color: '#19E341'}} />},
      ],
      grid: 'grid-cols-3',
      selection: 'primary',
    },
    {
      title: 'Add Ons',
      options: [
        {title: 'Num Pad', position: {x: -0.11, y: -0.01, z: 4.21}, rotation: {x: 47, y: 8, z: 0}, component: <SelectionAddOn img="/NumPad.jpg" />},
        {title: 'Note Pad', position: {x: -0.11, y: -0.01, z: 4.21}, rotation: {x: 47, y: 8, z: 0}, component: <SelectionAddOn img="/NotePad.jpg" />},
        {title: 'Mixer', position: {x: -0.11, y: -0.01, z: 4.21}, rotation: {x: 47, y: 8, z: 0}, component: <SelectionAddOn img="/Mixer.jpg" />},
      ],
      grid: 'grid-cols-3',
      selection: 'primary',
    },
    {
      title: 'Shop',
      type: 'shopify',
      grid: 'grid-cols-2',
      selection: 'primary',
      options: kbirdShopifyProducts.map((p) => ({
        title: p.title,
        productHandle: p.handle,
        position: p.position,
        rotation: p.rotation,
      })),
    },
  ],
};

export default kbirdSettings;
