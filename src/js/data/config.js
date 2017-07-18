import TWEEN from 'tween.js';

// This object contains the state of the app
export default {
  isDev: false,
  isLoaded: false,
  isTweening: false,
  isRotating: true,
  isMouseMoving: false,
  isMouseOver: false,
  maxAnisotropy: 1,
  dpr: 1,
  easing: TWEEN.Easing.Quadratic.InOut,
  duration: 500,
  colors: {
    external: 0x000000,
    internal: 0x000000,
  },
  model: {
    path: 'assets/models/kali-mug-real.json',
    scale: 1
  },
  texture: {
    path: 'assets/textures/',
    imageFiles: [
      {name: 'Photo', image: 'photo-in4.png', color: 0x000000},
    ]
  },
  mesh: {
    enableHelper: false,
    wireframe: false,
    translucent: false,
    material: {
      color: 0xffffff,
      emissive: 0xffffff
    }
  },
  fog: {
    color: 0xfafafa,
    near: 0
  },
  camera: {
    fov: 45,
    near: 1,
    far: 1000,
    aspect: 1,
    posX: -13,
    posY: -1,
    posZ: 0
  },
  controls: {
    autoRotate: false,
    autoRotateSpeed: -0.5,
    rotateSpeed: 0.5,
    zoomSpeed: 0.8,
    minDistance: 0,
    maxDistance:500,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    enableDamping: true,
    dampingFactor: 0.5,
    enableZoom: true,
    enableKeys: false,
    enablePan: true,
    target: {
      x: 0,
      y: 0,
      z: 0
    }
  },
  ambientLight: {
    enabled: true,
    color: 0x808080,
    intensity: 2.0
  },
  directionalLight: {
    enabled: true,
    color: 0xffffff,
    intensity: .2,
    x: -30,
    y: 20,
    z: 20
  },
  shadow: {
    enabled: true,
    helperEnabled: false,
    cameraRight: 1000,
    cameraLeft: -1000,
    cameraTop: 1000,
    cameraBottom: -1000,
    cameraNear: 0,
    cameraFar: 14000,
    mapWidth: 2048,
    mapHeight: 2048,
    bias: 0,
    cameraScaleX: .9,
    cameraScaleY: .9,
    radius: 1.0
  },
  pointLight: {
    enabled: false,
    color: 0xffffff,
    intensity: 1.0,
    distance: 115,
    x: 100,
    y: 100,
    z: 100
  },
  hemiLight: {
    enabled: false,
    color: 0xffffff,
    groundColor: 0xffffff,
    intensity: 5,
    x: 0,
    y: 0,
    z: 0
  }
};
