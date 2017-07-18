import Config from './data/config';
import Detector from './utils/detector';
import $ from 'zepto-webpack';
import createHistory from 'history/createBrowserHistory'
import Main from './app/main';

// Check environment and set the Config helper
if(__ENV__ == 'dev') {
  console.log('----- RUNNING IN DEV ENVIRONMENT! -----');

  //Config.isDev = true;
}

class P3DAppInit {
  constructor(context) {
    this.$context = $(context);
    this.history = createHistory();

    // Check for webGL capabilities
    if(!Detector.webgl) {
      // TODO: Add fall back here
      Detector.addGetWebGLMessage($context.get(0));
    } else {
      this.main = new Main(this.$context);
    }

    $('#ecolor').change(e => {
      if (!this.isHex($('#ecolor').val())) {
        return;
      }
      const color = this.getHex($('#ecolor').val());
      this.main.setExternalColor(color);
      this.updateUrl();
    });

    $('#icolor').change(e => {
      if (!this.isHex($('#icolor').val())) {
        return;
      }
      const color = this.getHex($('#icolor').val());
      this.main.setInternalColor(color);
      this.updateUrl();
    });

    $('#texfile').change(e => {
      const files = document.getElementById("texfile").files;
      const imageType = /^image\//;
      if (!imageType.test(files[0].type)) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => { this.loadTexture(e.target.result); };
      reader.readAsDataURL(files[0]);
    });

    $('#texurl').change(e => {
      this.loadTexture($('#texurl').val());
      this.updateUrl();
    });

    this.texture = document.getElementById('texture');
    this.textureContext = this.texture.getContext('2d');
    this.texture.width = 4096;
    this.texture.height = 4096;

    const search = document.location.search.replace(/\?(.*)/ig, '$1');
    const params = search.split('&');
    params.forEach(el => {
      let name, val;
      [name, val] = el.split('=');
      if (name === 'e' && this.isHex(val)){
        $('#ecolor').val(val);
        this.main.setExternalColor(this.getHex(val));
      }
      if (name === 'i' && this.isHex(val)){
        $('#icolor').val(val);
        this.main.setInternalColor(this.getHex(val));
      }
      if (name === 't') {
        console.log(decodeURIComponent(val));
        this.loadTexture(decodeURIComponent(val));
      }
    });
  }

  start() {
    if (this.main) {
      this.main.start();
    }
  }

  stop() {
    if (this.main) {
      this.main.stop();
    }
  }

  isHex(h){
    const re = /^[0-9a-f]{3,6}$/g;
    return re.test(h);
  }
  getHex(h){
    return parseInt(h,16);
  }

  loadTexture(tex){
    const texImage = new Image();
    texImage.crossOrigin = 'Anonymous';
    texImage.src = tex;
    texImage.onload = () => {
      this.textureContext.drawImage(texImage, 0, 0, 4096, 1596);
      this.main.updatePhoto(this.texture.toDataURL());
    };
  }

  updateUrl() {
    let added = false;
    let url = '?';
    if ($('#ecolor').val() !== '') {
      url += 'e=' + $('#ecolor').val();
      added = true;
    }
    if ($('#icolor').val() !== '') {
      if (added) {
        url += '&';
      }
      url += 'i=' + $('#icolor').val();
      added = true;
    }
    if ($('#texurl').val() !== '') {
      if (added) {
        url += '&';
      }
      url += 't=' + encodeURIComponent($('#texurl').val());
    }
    this.history.push(url, {});
  }
}

const p3dapp = new P3DAppInit(document.getElementById('pan3dapp'));
p3dapp.start();
