// Global imports -
import $ from 'zepto-webpack';
import * as THREE from 'three';
import TWEEN from 'tween.js';

// Local imports -
// Components
import Renderer from './components/renderer';
import Camera from './components/camera';
import Light from './components/light';
import Controls from './components/controls';

// Helpers
import Geometry from './helpers/geometry';

// Model
import Texture from './model/texture';
import Model from './model/model';

// Managers
import Interaction from './managers/interaction';
//import DatGUI from './managers/datGUI';

// data
import Config from './../data/config';
// -- End of imports

// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor($context) {
    this.started = false;

    this.$context = $context;

    // Set container property to container element
    this.container = this.$context.find('.main').get(0);

    // Start Three clock
    this.clock = new THREE.Clock();

    // Main scene creation
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Get Device Pixel Ratio first for retina
    if(window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    // Main renderer instantiation
    this.renderer = new Renderer(this.scene, this.container);

    // Components instantiation
    this.camera = new Camera(this.renderer.threeRenderer, this.scene);
    this.controls = new Controls(this.camera.threeCamera, this.container);
    this.light = new Light(this.scene);

    // Create and place lights in scene
    const lights = ['ambient', 'directional', 'point', 'hemi'];
    for(let i = 0; i < lights.length; i++) {
      this.light.place(lights[i]);
    }

    // Instantiate texture class
    this.texture = new Texture();
    this.manager = new THREE.LoadingManager();
    // onProgress callback
    this.manager.onProgress = (item, loaded, total) => {
      this.container.querySelector('#loading').innerHTML = ('Loading: ' + Math.ceil(loaded * 100 / total) + '%');
    };

    this.model = new Model(this.scene, this.manager, this.camera, this.renderer);

    this.model.load();

    // Start loading the textures and then setTexures for model
    this.texture.load(this.manager).then(() => {
      // Textures loaded, update model
      this.model.setTextures(this.texture.textures);
    });

    // All loaders done now
    this.manager.onLoad = () => {
      // Set up interaction manager with the app now that the model is finished loading
      this.interactions = new Interaction(this.renderer.threeRenderer, this.scene, this.camera.threeCamera, this.controls.threeControls);
      if (this.started) {
        this.interactions.start();
      }
      // Everything is now fully loaded
      Config.isLoaded = true;
      this.container.querySelector('#loading').style.display = 'none';

      /*const tgeometry = new THREE.SphereGeometry( .1, 32, 32 );
      const tmaterial = new THREE.MeshLambertMaterial({
        color: 0x4a9a5a
      });
      this.tsphere = new THREE.Mesh( tgeometry, tmaterial );
      const spherePos = this.camera.threeCamera.position.clone().multiplyScalar(.3);
      this.tsphere.position.set(spherePos.x, spherePos.y, spherePos.z);
      this.tsphere.castShadow = true;
      this.tsphere.receiveShadow = true;
      this.scene.add( this.tsphere );*/
    };
  }

  start() {
    this.started = true;
    // Start render which does not wait for model fully loaded
    this.render();
    if (this.interactions) {
      this.interactions.start();
    }
    this.controls.start();
  }

  stop() {
    if (this.interactions) {
      this.interactions.stop();
    }
    this.controls.stop();
    this.started = false;
  }

  setExternalColor(c) {
    Config.colors.external = c;
  }

  setInternalColor(c) {
    Config.colors.internal = c;
  }
  updatePhoto(data){
    this.model.updatePhotoTexture(data);
  }
  render() {
    const lightPos = this.camera.threeCamera.position.clone().multiply(new THREE.Vector3(1.0, 7.0, 1.2));
    this.light.directionalLight.position.set(lightPos.x, lightPos.y, lightPos.z);
    /*if (this.tsphere) {
      const spherePos = this.camera.threeCamera.position.clone().multiply(new THREE.Vector3(.8, .4, .4));
      this.tsphere.position.set(spherePos.x, spherePos.y, spherePos.z);
    }*/

    // Call render function and pass in created scene and camera
    this.renderer.render(this.scene, this.camera.threeCamera);

    // Delta time is sometimes needed for certain updates
    //const delta = this.clock.getDelta();

    // Call any vendor or module updates here
    TWEEN.update();
    this.controls.threeControls.update();

    if (this.model && this.model.update) {
      this.model.update();
    }

    if (this.started) {
      // RAF
      requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
    }

    /*const camPos = this.camera.threeCamera.getWorldPosition();
    $('.camera .x').html(camPos.x);
    $('.camera .y').html(camPos.y);
    $('.camera .z').html(camPos.z);
    const lightPos = this.light.directionalLight.getWorldPosition();
    $('.light .x').html(lightPos.x);
    $('.light .y').html(lightPos.y);
    $('.light .z').html(lightPos.z);*/

  }
}

