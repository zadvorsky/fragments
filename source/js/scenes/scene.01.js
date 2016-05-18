window.scenes['01'] = (function() {
  function Scene() {
    this.group = new THREE.Group();
    this.init();
  }
  Scene.prototype = {
    init: function() {
      var mesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(50),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true
        })
      );

      this.mesh = mesh;
      this.group.add(mesh);
    },
    destroy: function() {

    },
    show: function() {
      var mesh = this.mesh;

      return TweenMax.to({s:0.0}, 1.0, {s:1.0, onUpdate:function() {
        mesh.scale.setScalar(this.target.s);
      }});
    },
    hide: function() {
      var mesh = this.mesh;

      return TweenMax.to({s:1.0}, 1.0, {s:0.0, onUpdate:function() {
        mesh.scale.setScalar(this.target.s);
      }});
    }
  };

  return Scene;
})();
