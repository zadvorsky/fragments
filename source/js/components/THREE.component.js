Vue.component('three-view', {
  template: '<div id="three-container"></div>',
  ready: function() {
    var root = new THREERoot({
      container: '#three-container'
    });

    root.camera.position.set(0, 0, 300);

    //var geometry = new THREE.CylinderGeometry(600, 600, 1800, 32, 32, true);
    //var noise = 12;
    //
    //geometry.vertices.forEach(function(v) {
    //  v.x += THREE.Math.randFloatSpread(noise);
    //  v.y += THREE.Math.randFloatSpread(noise);
    //  v.z += THREE.Math.randFloatSpread(noise);
    //});
    //
    //var backgroundMesh = new THREE.Mesh(
    //  geometry,
    //  new THREE.MeshPhongMaterial({
    //    side: THREE.BackSide,
    //    shading: THREE.FlatShading,
    //    color: 0x141414,
    //    specular: 0x020202,
    //    shininess: 100
    //  })
    //);
    //root.add(backgroundMesh);
    //root.scene.fog = new THREE.FogExp2(0x000000);
    //
    //var light = new THREE.PointLight();
    //root.add(light);

    this.$root.$on('scene_enter', function(e) {
      console.log('three.view.scene_enter', e);
      root.add(e.scene);
    });

    this.$root.$on('scene_exit', function(e) {
      console.log('three.view.scene_exit', e);
      root.remove(e.scene);
    });
  }
});
