const macbookSettings = {
  meta: {name: 'MacBook', model: 'macbook', version: '1.0'},
  defaults: {lighting: 'studio', background: '#090909', accentColor: '#ff0000'},
  sections: [
    {
      title: 'Screen',
      options: [
        {
          title: 'Overview',
          default: true,
        position: {x: 0, y: -0.6118500000000001, z: 2.01355},
rotation: {x: 0, y: 0, z: 0},
          screenParams: {type: 'showcase', backgroundColor: '#0a0a0a', scale: 0.3, rotationSpeed: 0.3},
        },
        {
          title: 'Configure',
          position: {x: 0, y: -0.2704, z: -0.20660000000000034},
          rotation: {x: -11, y: 0, z: 0},
          screenParams: {type: 'configure', backgroundColor: '#0a0a0a', scale: 0.3, rotationSpeed: 0.4},
        },
        {
          title: 'Visualize',
          position: {x: -0.13185, y: -0.2704, z: 1.8331499999999998},
          rotation: {x: 0, y: -34, z: 0},
          screenParams: {type: 'visualize', backgroundColor: '#f1f1f1', scale: 0.6, rotationSpeed: 0.4},
        },
        {
          title: 'Customize',
          position: {x: -0.6532500000000001, y: -0.634, z: 1.07845},
          rotation: {x: 54, y: -51, z: 0},
          screenParams: {type: 'customize', backgroundColor: '#0000ff', scale: 0.3, rotationSpeed: 1.2},
        },
        {
          title: 'Present',
          position: {x: 0, y: -0.98645, z: 0},
          rotation: {x: 53, y: 0, z: 0},
          screenParams: {type: 'present', backgroundColor: '#0a0a0a', scale: 0.15, rotationSpeed: 0.2},
        },
      ],
      grid: 'grid-cols-1',
      selection: 'secondary',
    },
  ],
};

export default macbookSettings;
