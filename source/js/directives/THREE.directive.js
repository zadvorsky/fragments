Vue.directive('three-view', {
  bind: function() {
    var root = new THREERoot({
      container: this.el
    });

    root.add(new THREE.AxisHelper(50));
    root.camera.position.set(0, 0, 300);

    this.vm.$root.$on('scene_enter', function(e) {
      console.log('three.view.scene_enter', e);
      root.add(e.scene);
    });

    this.vm.$root.$on('scene_exit', function(e) {
      console.log('three.view.scene_exit', e);
      root.remove(e.scene);
    });
  }
});
