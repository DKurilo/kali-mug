import * as THREE from 'three';

import Material from '../helpers/material';
import MeshHelper from '../helpers/meshHelper';
import Helpers from '../../utils/helpers';
import Config from '../../data/config';

// Loads in a single object from the config file
export default class Model {
  constructor(scene, manager, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Manager is passed in to loader to determine when loading done in main
    this.loader = new THREE.ObjectLoader(manager);

    this.manager = manager;
    this.obj = null;

    this.opacity = 0;
    this.buildingOpacity = 1;

    this.textures = null;

    this.loaded = false;

    this.needToUpdateTexture = false;
  }

  load() {
    // Load model with ObjectLoader
    this.loader.load(Config.model.path, obj => {
      // Set prop to obj
      this.obj = obj;
      if (this.textures) {
        this.init();
      }
    }, Helpers.logProgress(), Helpers.logError());
  }

  setTextures(textures) {
    this.textures = textures;
    if (this.obj) {
      this.init();
    }
  }

  init(){
    this.obj.traverse(child => {
      if(child instanceof THREE.Mesh) {
        child.opacity = 1.0;

        child.geometry.computeVertexNormals();

        const material = new Material(this.getMeshColor(child.name), this.textures[child.name]);
        child.material = material.standard;
        child.myMaterial = material;
      }
    });

    if (this.needToUpdateTexture) {
      this.updatePhotoTexture(this.needToUpdateTexture);
      this.needToUpdateTexture = null;
    }

    this.obj.scale.multiplyScalar(Config.model.scale);
    this.scene.add(this.obj);
    this.scene.updateMatrixWorld(true);
    this.loaded = true;
  }

  update(){
    if (!this.loaded) {
      return;
    }

    if (this.opacity < 1.0) {
      this.opacity += .05;
    } else {
      this.opacity = 1.0;
    }

    this.obj.traverse(child => {
      if(child instanceof THREE.Mesh) {
        if (child.myMaterial.updateTime) {
          child.myMaterial.updateTime(this.opacity, this.getMeshColor(child.name));
        }
      }
    });

  }

  getMeshColor(meshname){
    let color = 0x000000;
    if (meshname === 'ExternalMug' || meshname === 'Photo') {
      color = Config.colors.external;
    }
    if (meshname === 'InternalMug') {
      color = Config.colors.internal;
    }
    return color;
  }

  updatePhotoTexture(data){
    if (this.obj === null) {
      this.needToUpdateTexture = data;
      return;
    }
    this.obj.traverse(child => {
      if(child instanceof THREE.Mesh && child.name === 'Photo') {
        child.myMaterial.updateTexture(data);
      }
    });
  }
}
