import * as THREE from 'three';
import $ from 'zepto-webpack';

import Keyboard from '../../utils/keyboard';
import Helpers from '../../utils/helpers';
import Config from '../../data/config';


// Manages all input interactions
export default class Interaction {
  constructor(renderer, scene, camera, controls) {
    // Properties
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.timeout = null;
    this.mousedown = null;
  }

  start() {
  }

  stop() {
  }
}
