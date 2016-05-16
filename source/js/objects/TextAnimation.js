function TextAnimation(data) {
  var textGeometry = data.geometry;

  var bufferGeometry = new TextAnimationGeometry(textGeometry);

  var aAnimation = bufferGeometry.createAttribute('aAnimation', 2);
  var aStartPosition = bufferGeometry.createAttribute('aStartPosition', 3);
  var aEndPosition = bufferGeometry.createAttribute('aEndPosition', 3);
  var aAxisAngle = bufferGeometry.createAttribute('aAxisAngle', 4);

  var minDuration = 1.0;
  var maxDuration = 2.0;

  this.animationDuration = maxDuration + data.info.length * settings.letterTimeOffset;

  var axis = new THREE.Vector3();
  var angle;

  var glyphSize = new THREE.Vector3();
  var glyphCenter = new THREE.Vector3();
  var centroidLocal = new THREE.Vector3();
  var delta = new THREE.Vector3();

  for (var f = 0; f < data.info.length; f++) {
    bufferChar(data.info[f], f);
  }

  function bufferChar(info, index) {
    var s = info.faceOffset;
    var l = info.faceOffset + info.faceCount;
    var box = info.boundingBox;
    var glyphOffset = info.glyphOffset;

    box.size(glyphSize);
    box.center(glyphCenter);

    var i, i2, i3, i4, v;

    var delay = index * settings.letterTimeOffset;

    for (i = s, i2 = s * 6, i3 = s * 9, i4 = s * 12; i < l; i++, i2 += 6, i3 += 9, i4 += 12) {

      var face = textGeometry.faces[i];
      var centroid = THREE.BAS.Utils.computeCentroid(textGeometry, face);

      // animation

      var duration = THREE.Math.randFloat(minDuration, maxDuration);

      for (v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v    ] = delay;
        aAnimation.array[i2 + v + 1] = duration;
      }

      // start position (centroid)
      for (v = 0; v < 9; v+= 3) {
        aStartPosition.array[i3 + v    ] = centroid.x;
        aStartPosition.array[i3 + v + 1] = centroid.y;
        aStartPosition.array[i3 + v + 2] = centroid.z;
      }

      // end position
      centroidLocal.copy(centroid);
      centroidLocal.x -= glyphOffset;
      delta.subVectors(centroidLocal, glyphCenter);

      var x = delta.x * THREE.Math.randFloat(4.0, 12.0);
      var y = delta.y * THREE.Math.randFloat(4.0, 12.0);
      var z = delta.z * THREE.Math.randFloat(4.0, 12.0);

      for (v = 0; v < 9; v += 3) {
        aEndPosition.array[i3 + v    ] = centroid.x + x;
        aEndPosition.array[i3 + v + 1] = centroid.y + y;
        aEndPosition.array[i3 + v + 2] = centroid.z + z;
      }

      // axis angle
      axis.x = THREE.Math.randFloatSpread(2);
      axis.y = THREE.Math.randFloatSpread(2);
      axis.z = THREE.Math.randFloatSpread(2);
      axis.normalize();
      angle = Math.PI * THREE.Math.randFloat(4.0, 8.0);

      for (v = 0; v < 12; v += 4) {
        aAxisAngle.array[i4 + v    ] = axis.x;
        aAxisAngle.array[i4 + v + 1] = axis.y;
        aAxisAngle.array[i4 + v + 2] = axis.z;
        aAxisAngle.array[i4 + v + 3] = angle;
      }
    }
  }

  var material = new THREE.BAS.PhongAnimationMaterial({
      shading: THREE.FlatShading,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTime: {type: 'f', value: 0}
      },
      shaderFunctions: [
        THREE.BAS.ShaderChunk['cubic_bezier'],
        THREE.BAS.ShaderChunk['ease_out_cubic'],
        THREE.BAS.ShaderChunk['quaternion_rotation']
      ],
      shaderParameters: [
        'uniform float uTime;',
        'uniform vec3 uAxis;',
        'uniform float uAngle;',
        'attribute vec2 aAnimation;',
        'attribute vec3 aStartPosition;',
        'attribute vec3 aEndPosition;',
        'attribute vec4 aAxisAngle;'
      ],
      shaderVertexInit: [
        'float tDelay = aAnimation.x;',
        'float tDuration = aAnimation.y;',
        'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
        //'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
        'float tProgress = tTime / tDuration;'
      ],
      shaderTransformPosition: [
        // scale
        'transformed *= 1.0 - tProgress;',

        // rotate
        'float angle = aAxisAngle.w * tProgress;',
        'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);',
        'transformed = rotateVector(tQuat, transformed);',

        // translate
        'transformed += mix(aStartPosition, aEndPosition, tProgress);'
      ]
    },
    {
      //diffuse: 0x444444,
      //specular: 0xcccccc,
      //shininess: 4,
      //emissive: 0x444444
    }
  );

  THREE.Mesh.call(this, bufferGeometry, material);

  this.frustumCulled = false;
}
TextAnimation.prototype = Object.create(THREE.Mesh.prototype);
TextAnimation.prototype.constructor = TextAnimation;
Object.defineProperty(TextAnimation.prototype, 'time', {
  get: function() {
    return this.material.uniforms['uTime'].value;
  },
  set: function(v) {
    this.material.uniforms['uTime'].value = v;
  }
});

function TextAnimationGeometry(model) {
  THREE.BAS.ModelBufferGeometry.call(this, model);
}
TextAnimationGeometry.prototype = Object.create(THREE.BAS.ModelBufferGeometry.prototype);
TextAnimationGeometry.prototype.constructor = TextAnimationGeometry;
TextAnimationGeometry.prototype.bufferPositions = function() {
  var positionBuffer = this.createAttribute('position', 3).array;

  for (var i = 0; i < this.faceCount; i++) {
    var face = this.modelGeometry.faces[i];
    var centroid = THREE.BAS.Utils.computeCentroid(this.modelGeometry, face);

    var a = this.modelGeometry.vertices[face.a];
    var b = this.modelGeometry.vertices[face.b];
    var c = this.modelGeometry.vertices[face.c];

    positionBuffer[face.a * 3    ] = a.x - centroid.x;
    positionBuffer[face.a * 3 + 1] = a.y - centroid.y;
    positionBuffer[face.a * 3 + 2] = a.z - centroid.z;

    positionBuffer[face.b * 3    ] = b.x - centroid.x;
    positionBuffer[face.b * 3 + 1] = b.y - centroid.y;
    positionBuffer[face.b * 3 + 2] = b.z - centroid.z;

    positionBuffer[face.c * 3    ] = c.x - centroid.x;
    positionBuffer[face.c * 3 + 1] = c.y - centroid.y;
    positionBuffer[face.c * 3 + 2] = c.z - centroid.z;
  }
};