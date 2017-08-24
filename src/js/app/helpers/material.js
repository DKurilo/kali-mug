import * as THREE from 'three';

// USe this class as a helper to set up some default materials
export default class Material {
  constructor(color, texture) {
    if (texture) {
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.LinearFilter;
    }
    this.color = new THREE.Color(color);

    const uniforms = THREE.UniformsUtils.merge([THREE.UniformsUtils.clone(THREE.ShaderLib.phong.uniforms), {
      photo: { type: "t", value: null}, usephoto:  { type: "i", value: 0 }
    }]);

    //uniforms.color.value = color;
    uniforms.reflectivity.value = .5;
    uniforms.refractionRatio.value = .1;
    uniforms.shininess.value = 30;
    uniforms.diffuse.value = this.color;
    uniforms.specular.value = new THREE.Color(0xeeeeee);
    uniforms.opacity.value = 1.0;
    if (texture) {
      uniforms.usephoto.value = 1.0;
      uniforms.photo.value = texture;
    }

    const fragmentShader = `#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
uniform sampler2D photo;
uniform float usephoto;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

  #include <clipping_planes_fragment>

  vec4 diffuseColor = vec4( diffuse, opacity );

  if (usephoto > 0.0) {
    vec4 photoColor = texture2D( photo, vUv );
    if (photoColor.a > 0.0){
      diffuseColor = vec4( diffuse * (1.0 - photoColor.a) + photoColor.xyz * photoColor.a, opacity );
    }
  }
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive;

  #include <logdepthbuf_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  #include <normal_flip>
  #include <normal_fragment>
  #include <emissivemap_fragment>

  // accumulation
  #include <lights_phong_fragment>
  #include <lights_template>

  // modulation
  #include <aomap_fragment>

  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

  #include <envmap_fragment>

  gl_FragColor = vec4( outgoingLight, diffuseColor.a);

  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>

}`;

    this.standard = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: THREE.ShaderLib.phong.vertexShader,
      defines: {"USE_MAP": ""},
      uniforms: uniforms,
      lights: true,
      fog: false,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: .001,
    });
    if (texture) {
      this.standard.map = texture;
    }

    this.step = 0.0;

    this.needToUpdate = true;
  }

  updateTexture(data){
    const texture = new THREE.TextureLoader().load( data );
    this.standard.map = texture;
    this.standard.uniforms.photo.value = texture;
    this.standard.uniforms.usephoto.value = 1.0;
  }

  updateTime(opacity, color){
    if (this.step < 100) {
      this.step += 4;
      if (this.step >= 100) {
        this.step = 100;
      }
    }
    if (color !== undefined && this.color.getHex() !== color) {
      this.color = new THREE.Color(color);
      this.standard.uniforms.diffuse.value = this.color;
    }
    //this.standard.uniforms.opacity.value = opacity * .01 * this.step;
  }
}
