window.scenes['00'] = (function() {
  function Scene(assets) {
    this.group = new THREE.Group();
    this.init(assets);
  }
  Scene.prototype = {
    init: function(assets) {
      var textGeometry = utils.generateTextGeometry('PIECE BY PIECE', {
        size: 14,
        height: 2,
        font: assets.get('droid_sans_bold'),
        weight: 'bold',
        style: 'normal',
        bevelSize: 0.75,
        bevelThickness: 0.50,
        bevelEnabled: true,
        anchor: {x:0.5, y:0.5, z:0.5}
      });

      var textAnimation = new TextAnimation(textGeometry);

      var tween = TweenMax.fromTo(textAnimation, 4,
        {animationProgress:0},
        {animationProgress:1, ease:Power1.easeInOut, repeat:-1, repeatDelay:1, yoyo:true}
      );

      this.tween = tween;
      this.group.add(textAnimation);
    },
    destroy: function() {

    },
    show: function() {
      var mesh = this.group;

      return TweenMax.to({s:0.0}, 1.0, {s:1.0, onUpdate:function() {
        mesh.scale.setScalar(this.target.s);
      }});
    },
    hide: function() {
      var mesh = this.group;

      return TweenMax.to({s:1.0}, 1.0, {s:0.0, onUpdate:function() {
        mesh.scale.setScalar(this.target.s);
      }});
    }
  };

  function TextAnimation(textGeometry) {
    var bufferGeometry = new THREE.BAS.ModelBufferGeometry(textGeometry);

    var aAnimation = bufferGeometry.createAttribute('aAnimation', 2);
    var aControl0 = bufferGeometry.createAttribute('aControl0', 3);
    var aControl1 = bufferGeometry.createAttribute('aControl1', 3);
    var aEndPosition = bufferGeometry.createAttribute('aEndPosition', 3);

    var faceCount = bufferGeometry.faceCount;
    var i, i2, i3, i4, v;

    var size = textGeometry.boundingBox.size();
    var length = new THREE.Vector3(size.x, size.y, size.z).multiplyScalar(0.5).length();
    var maxDelay = length * 0.06;

    this.animationDuration = maxDelay + 4 + 1;
    this._animationProgress = 0;

    for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
      var face = textGeometry.faces[i];
      var centroid = THREE.BAS.Utils.computeCentroid(textGeometry, face);
      var dirX = centroid.x > 0 ? 1 : -1;
      var dirY = centroid.y > 0 ? 1 : -1;

      // animation
      var delay = centroid.length() * THREE.Math.randFloat(0.03, 0.06);
      var duration = THREE.Math.randFloat(2, 4);

      for (v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v    ] = delay + Math.random();
        aAnimation.array[i2 + v + 1] = duration;
      }

      // ctrl
      var c0x = THREE.Math.randFloat(0, 30) * dirX;
      var c0y = THREE.Math.randFloat(60, 120) * dirY;
      var c0z = THREE.Math.randFloat(-20, 20);

      var c1x = THREE.Math.randFloat(30, 60) * dirX;
      var c1y = THREE.Math.randFloat(0, 60) * dirY;
      var c1z = THREE.Math.randFloat(-20, 20);

      for (v = 0; v < 9; v += 3) {
        aControl0.array[i3 + v    ] = c0x;
        aControl0.array[i3 + v + 1] = c0y;
        aControl0.array[i3 + v + 2] = c0z;

        aControl1.array[i3 + v    ] = c1x;
        aControl1.array[i3 + v + 1] = c1y;
        aControl1.array[i3 + v + 2] = c1z;
      }
    }

    var material = new THREE.BAS.BasicAnimationMaterial({
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: {type: 'f', value: 0}
        },
        vertexFunctions: [
          THREE.BAS.ShaderChunk['cubic_bezier']
        ],
        vertexParameters: [
          'uniform float uTime;',
          'attribute vec2 aAnimation;',
          'attribute vec3 aControl0;',
          'attribute vec3 aControl1;',
          'attribute vec3 aEndPosition;'
        ],
        vertexInit: [
          'float tDelay = aAnimation.x;',
          'float tDuration = aAnimation.y;',
          'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
          'float tProgress = tTime / tDuration;'
        ],
        vertexPosition: [
          'vec3 tPosition = transformed;',
          'tPosition *= 1.0 - tProgress;',
          'tPosition += cubicBezier(transformed, aControl0, aControl1, aEndPosition, tProgress);',
          'transformed = tPosition;'
        ]
      },
      {
        diffuse: 0xffffff
      }
    );

    THREE.Mesh.call(this, bufferGeometry, material);

    this.frustumCulled = false;
  }
  TextAnimation.prototype = Object.create(THREE.Mesh.prototype);
  TextAnimation.prototype.constructor = TextAnimation;

  Object.defineProperty(TextAnimation.prototype, 'animationProgress', {
    get: function() {
      return this._animationProgress;
    },
    set: function(v) {
      this._animationProgress = v;
      this.material.uniforms['uTime'].value = this.animationDuration * v;
    }
  });

  return Scene;
})();
