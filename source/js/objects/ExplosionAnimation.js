function ExplosionAnimation(data) {
  var letterCount = data.info.length;
  var prefabsPerLetter = 750;
  var prefabCount = prefabsPerLetter * letterCount;
  var prefabSize = 2.0;

  // var prefabGeometry = new THREE.TetrahedronGeometry(prefabSize);
  var prefabGeometry = new THREE.PlaneGeometry(prefabSize, prefabSize, 1, 4);

  var geometry = new ExplosionAnimationGeometry(prefabGeometry, prefabCount);

  var aDelayDuration = geometry.createAttribute('aDelayDuration', 2);
  var aColor = geometry.createAttribute('color', 3);
  var aStartPosition = geometry.createAttribute('aStartPosition', 3);
  var aControlPosition0 = geometry.createAttribute('aControlPosition0', 3);
  var aControlPosition1 = geometry.createAttribute('aControlPosition1', 3);
  var aEndPosition = geometry.createAttribute('aEndPosition', 3);
  var aAxisAngle = geometry.createAttribute('aAxisAngle', 4);

  var duration, delay;
  var minDuration = 0.25;
  var maxDuration = 0.5;
  var vertexDelay = 0.0125;

  this.animationDuration = (maxDuration + vertexDelay * prefabGeometry.vertices.length) * letterCount * settings.letterTimeOffset;

  var glyphSize = new THREE.Vector3();
  var glyphCenter = new THREE.Vector3();

  for (var index = 0; index < letterCount; index++) {
    var letterOffset = prefabsPerLetter * index;
    var letterBox = data.info[index].boundingBox;
    letterBox.size(glyphSize);
    letterBox.center(glyphCenter);
    glyphCenter.x += data.info[index].glyphOffset;

    var i, j, offset;

    delay = index * settings.letterTimeOffset;

    for (i = 0, offset = letterOffset * prefabGeometry.vertices.length * 2; i < prefabCount; i++) {
      duration = THREE.Math.randFloat(minDuration, maxDuration);

      for (j = 0; j < prefabGeometry.vertices.length; j++) {

        aDelayDuration.array[offset++] = delay + vertexDelay * j * duration;
        aDelayDuration.array[offset++] = duration;
      }
    }

    var color = data.info[index].color;
    var colorHSL = color.getHSL();
    var h, s, l;

    for (i = 0, offset = letterOffset * prefabGeometry.vertices.length * 3; i < prefabCount; i++) {
      h = colorHSL.h;
      s = THREE.Math.randFloat(0.50, 1.00);
      l = THREE.Math.randFloat(0.25, 0.75);
      color.setHSL(h, s, l);

      for (j = 0; j < geometry.prefabVertexCount; j++) {
        aColor.array[offset  ] = color.r;
        aColor.array[offset+1] = color.g;
        aColor.array[offset+2] = color.b;

        offset += 3;
      }
    }

    var u, v, sp, ep, cp0, cp1;

    for (i = 0, offset = letterOffset * prefabGeometry.vertices.length * 3; i < prefabCount; i++) {
      sp = glyphCenter;

      u = Math.random();
      v = Math.random();
      ep = utils.spherePoint(u, v);
      ep.x *= THREE.Math.randFloat(40, 80);
      ep.y *= THREE.Math.randFloat(80, 120);
      ep.z *= THREE.Math.randFloat(40, 80);

      u *= THREE.Math.randFloat(0.8, 1.2);
      v *= THREE.Math.randFloat(0.8, 1.2);
      cp0 = utils.spherePoint(u, v);
      cp0.x *= THREE.Math.randFloat(10, 20);
      cp0.y *= THREE.Math.randFloat(40, 60);
      cp0.z *= THREE.Math.randFloat(10, 20);

      u *= THREE.Math.randFloat(0.8, 1.2);
      v *= THREE.Math.randFloat(0.8, 1.2);
      cp1 = utils.spherePoint(u, v);
      cp1.x *= THREE.Math.randFloat(20, 40);
      cp1.y *= THREE.Math.randFloat(60, 80);
      cp1.z *= THREE.Math.randFloat(20, 40);

      for (j = 0; j < prefabGeometry.vertices.length; j++) {
        aStartPosition.array[offset  ] = sp.x;
        aStartPosition.array[offset+1] = sp.y;
        aStartPosition.array[offset+2] = sp.z;

        aEndPosition.array[offset  ] = sp.x + ep.x;
        aEndPosition.array[offset+1] = sp.y + ep.y;
        aEndPosition.array[offset+2] = sp.z + ep.z;

        aControlPosition0.array[offset  ] = sp.x + cp0.x;
        aControlPosition0.array[offset+1] = sp.y + cp0.y;
        aControlPosition0.array[offset+2] = sp.z + cp0.z;

        aControlPosition1.array[offset  ] = sp.x + cp1.x;
        aControlPosition1.array[offset+1] = sp.y + cp1.y;
        aControlPosition1.array[offset+2] = sp.z + cp1.z;

        offset += 3;
      }
    }
  }

  var material = new THREE.BAS.BasicAnimationMaterial({
      vertexColors: THREE.VertexColors,
      side:THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uScale: {type: 'f', value: 1.0}
      },
      shaderFunctions: [
        THREE.BAS.ShaderChunk['quaternion_rotation'],
        THREE.BAS.ShaderChunk['cubic_bezier'],
        THREE.BAS.ShaderChunk['ease_out_cubic']
      ],
      shaderParameters: [
        'uniform float uTime;',

        'attribute vec2 aDelayDuration;',
        'attribute vec3 aStartPosition;',
        'attribute vec3 aControlPosition0;',
        'attribute vec3 aControlPosition1;',
        'attribute vec3 aEndPosition;',
        'attribute vec4 aAxisAngle;'
      ],
      shaderVertexInit: [
        'float tDelay = aDelayDuration.x;',
        'float tDuration = aDelayDuration.y;',
        'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
        //'float tProgress = ease(tTime, 0.0, 1.0, tDuration);',
        'float tProgress = tTime / tDuration;'
      ],
      shaderTransformPosition: [
        'float scl = tProgress * 2.0 - 1.0;',
        'transformed *= (1.0 - scl * scl);',
        'transformed += cubicBezier(aStartPosition, aControlPosition0, aControlPosition1, aEndPosition, tProgress);'
      ]
    },{}
  );

  THREE.Mesh.call(this, geometry, material);
  this.frustumCulled = false;
}
ExplosionAnimation.prototype = Object.create(THREE.Mesh.prototype);
ExplosionAnimation.prototype.constructor = ExplosionAnimation;
Object.defineProperty(ExplosionAnimation.prototype, 'time', {
  get: function() {
    return this.material.uniforms['uTime'].value;
  },
  set: function(v) {
    this.material.uniforms['uTime'].value = v;
  }
});

function ExplosionAnimationGeometry(prefab, count) {
  THREE.BAS.PrefabBufferGeometry.call(this, prefab, count);
}
ExplosionAnimationGeometry.prototype = Object.create(THREE.BAS.PrefabBufferGeometry.prototype);
ExplosionAnimationGeometry.prototype.constructor = ExplosionAnimationGeometry;
ExplosionAnimationGeometry.prototype.bufferPositions = function() {
  var positionBuffer = this.createAttribute('position', 3).array;

  var scaleMatrix = new THREE.Matrix4();
  var scale;
  var p = new THREE.Vector3();

  for (var i = 0, offset = 0; i < this.prefabCount; i++) {
    for (var j = 0; j < this.prefabVertexCount; j++, offset += 3) {
      var prefabVertex = this.prefabGeometry.vertices[j];

      scale = Math.random();
      scaleMatrix.identity().makeScale(scale, scale, scale);

      p.copy(prefabVertex);
      p.applyMatrix4(scaleMatrix);

      positionBuffer[offset    ] = p.x;
      positionBuffer[offset + 1] = p.y;
      positionBuffer[offset + 2] = p.z;
    }
  }
};