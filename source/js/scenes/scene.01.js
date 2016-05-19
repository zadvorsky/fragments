window.Scenes['01'] = (function() {
  function Scene(assets) {
    this.group = new THREE.Group();
    this.init(assets);
  }
  Scene.prototype = {
    init: function(assets) {
      var textGeometry = utils.generateTextGeometry('UP IN SMOKE', {
        size: 14,
        height: 0,
        font: assets.get('droid_sans_bold'),
        weight:'bold',
        style:'normal',
        bevelSize:0.75,
        bevelThickness:0.50,
        bevelEnabled:true,
        anchor:{x:0.5, y:0.0, z:0.5}
      });

      var textAnimation = new TextAnimation(textGeometry);

      var tween = TweenMax.fromTo(textAnimation, 4,
        {animationProgress:0},
        {animationProgress:1, ease:Power1.easeInOut, repeat:-1, repeatDelay:1.0, yoyo:true}
      );

      this.tween = tween;
      this.group.add(textAnimation);
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
    var aCentroid = bufferGeometry.createAttribute('aCentroid', 3);
    var aControl0 = bufferGeometry.createAttribute('aControl0', 3);
    var aControl1 = bufferGeometry.createAttribute('aControl1', 3);
    var aEndPosition = bufferGeometry.createAttribute('aEndPosition', 3);

    var faceCount = bufferGeometry.faceCount;
    var i, i2, i3, i4, v;

    var size = textGeometry.boundingBox.size();

    var maxDelayX = 2.0;
    var maxDelayY = 0.25;
    var minDuration = 4;
    var maxDuration = 8;
    var stretch = 0.25;

    this.animationDuration = maxDelayX + maxDelayY + maxDuration - 3;
    this._animationProgress = 0;

    for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
      var face = textGeometry.faces[i];
      var centroid = THREE.BAS.Utils.computeCentroid(textGeometry, face);

      // animation
      var delayX = Math.max(0, (centroid.x / size.x) * maxDelayX);
      var delayY = Math.max(0, (1.0 - (centroid.y / size.y)) * maxDelayY);
      var duration = THREE.Math.randFloat(minDuration, maxDuration);

      for (v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v    ] = delayX + delayY + Math.random() * stretch;
        aAnimation.array[i2 + v + 1] = duration;
      }

      // centroid
      for (v = 0; v < 9; v += 3) {
        aCentroid.array[i3 + v    ] = centroid.x;
        aCentroid.array[i3 + v + 1] = centroid.y;
        aCentroid.array[i3 + v + 2] = centroid.z;
      }

      // ctrl
      var c0x = centroid.x + THREE.Math.randFloat(40, 120);
      var c0y = centroid.y + size.y * THREE.Math.randFloat(0.0, 12.0);
      var c0z = THREE.Math.randFloatSpread(120);

      var c1x = centroid.x + THREE.Math.randFloat(80, 120) * -1;
      var c1y = centroid.y + size.y * THREE.Math.randFloat(0.0, 12.0);
      var c1z = THREE.Math.randFloatSpread(120);

      for (v = 0; v < 9; v += 3) {
        aControl0.array[i3 + v    ] = c0x;
        aControl0.array[i3 + v + 1] = c0y;
        aControl0.array[i3 + v + 2] = c0z;

        aControl1.array[i3 + v    ] = c1x;
        aControl1.array[i3 + v + 1] = c1y;
        aControl1.array[i3 + v + 2] = c1z;
      }

      // end position
      var x, y, z;

      x = centroid.x + THREE.Math.randFloatSpread(120);
      y = centroid.y + size.y * THREE.Math.randFloat(4.0, 12.0);
      z = THREE.Math.randFloat(-20, 20);

      for (v = 0; v < 9; v += 3) {
        aEndPosition.array[i3 + v    ] = x;
        aEndPosition.array[i3 + v + 1] = y;
        aEndPosition.array[i3 + v + 2] = z;
      }
    }

    var material = new THREE.BAS.BasicAnimationMaterial({
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: {type: 'f', value: 0}
        },
        vertexFunctions: [
          THREE.BAS.ShaderChunk['cubic_bezier'],
          THREE.BAS.ShaderChunk['ease_out_cubic']
        ],
        vertexParameters: [
          'uniform float uTime;',
          'attribute vec2 aAnimation;',
          'attribute vec3 aCentroid;',
          'attribute vec3 aControl0;',
          'attribute vec3 aControl1;',
          'attribute vec3 aEndPosition;'
        ],
        vertexInit: [
          'float tDelay = aAnimation.x;',
          'float tDuration = aAnimation.y;',
          'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
          'float tProgress =  ease(tTime, 0.0, 1.0, tDuration);'
          //'float tProgress = tTime / tDuration;'
        ],
        vertexPosition: [
          'vec3 tPosition = transformed - aCentroid;',
          'tPosition *= 1.0 - tProgress;',
          'tPosition += aCentroid;',
          'tPosition += cubicBezier(tPosition, aControl0, aControl1, aEndPosition, tProgress);',
          'transformed = tPosition;'

          // 'vec3 tPosition = transformed;',
          // 'tPosition *= 1.0 - tProgress;',
          // 'tPosition += cubicBezier(transformed, aControl0, aControl1, aEndPosition, tProgress);',
          // 'tPosition += mix(transformed, aEndPosition, tProgress);',
          // 'transformed = tPosition;'
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
