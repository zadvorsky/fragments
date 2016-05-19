Vue.directive('tween-progress-control', {
  bind: function() {
    console.log('bind', this);

    var track = this.el.querySelector('.tween-control__track');
    var head = this.el.querySelector('.tween-control__head');

    var isDragging = false;

    Draggable.create(head, {
      type: "x",
      edgeResistance: 1,
      bounds: track,
      cursor: 'pointer',
      lockAxis: true,
      throwProps: false,
      onDragStart: function() {
        if (this.tween) {
          isDragging = true;
          TweenMax.to(this.tween, 0.25, {timeScale:0});
        }
      },
      onDrag: function() {
        if (this.tween) {
          var p = head._gsTransform.x / (track.clientWidth - head.clientWidth);
          this.tween.progress(p);
        }
      },
      onDragEnd: function() {
        if (this.tween) {
          isDragging = false;
          TweenMax.to(this.tween, 0.25, {timeScale:1});
        }
      },

      callbackScope: this
    });

    TweenMax.ticker.addEventListener('tick', _.bind(function() {
      if (this.tween && !isDragging) {
        var x = this.tween.progress() * (track.clientWidth - head.clientWidth);
        TweenMax.set(head, {x:x});
      }
    }, this));
  },
  update: function(newValue, oldValue) {
    console.log('change', newValue, oldValue);

    newValue.tween && (this.tween = newValue.tween);
  }
});
