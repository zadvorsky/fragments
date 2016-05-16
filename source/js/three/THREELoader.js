function THREELoader(onComplete) {
  this.manager = new THREE.LoadingManager(onComplete);
  this.data = {};
}
THREELoader.prototype = {
  loadTexture: function(key, path, onComplete) {
    var data = this.data;

    new THREE.TextureLoader(this.manager).load(path, function(texture) {
      data[key] = texture;
      onComplete && onComplete(texture);
    });
  },
  loadFont: function(key, path, onComplete) {
    var data = this.data;

    new THREE.FontLoader(this.manager).load(path, function(font) {
      data[key] = font;
      onComplete && onComplete(font);
    });
  },
  get: function(key) {
    return this.data[key];
  }
};
