window.scenes['03'] = function() {
  this.group = new THREE.Group();

  this.init();
};

window.scenes['03'].prototype = {
  init: function() {
    var mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(50, 8),
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
