Vue.directive('tween-progress-control', {
  bind: function() {
    var track = this.el.querySelector('.tween-control__track');
    var head = this.el.querySelector('.tween-control__head');

    var isDragging = false;

    var dHead = Draggable.create(head, {
      type: "x",
      bounds: track,
      cursor: 'pointer',
      onDragStart: function() {
        if (this.tween && !isDragging) {
          isDragging = true;
          slowDownTween.call(this);
        }
      },
      onDrag: function() {
        if (this.tween) {
          updateTweenProgress.call(this);
        }
      },
      onDragEnd: function() {
        if (this.tween) {
          isDragging = false;
          speedUpTween.call(this);
        }
      },

      callbackScope: this
    })[0];

    Draggable.create(track, {
      bounds: track,
      cursor: 'pointer',
      onPress: function(e) {
        if (this.tween && e.target === track) {
          var x = e.clientX - track.getBoundingClientRect().left;

          isDragging = true;

          TweenMax.to(dHead.target, 0.5, {
            x:x,
            onComplete: function() {
              dHead.startDrag(e);
            },
            onUpdate: updateTweenProgress,
            callbackScope: this
          });

          slowDownTween.call(this);
        }
      },
      onRelease: function() {
        if (this.tween) {
          isDragging = false;
          speedUpTween.call(this);
        }
      },

      callbackScope: this
    });

    function updateTweenProgress() {
      this.tween.progress(head._gsTransform.x / (track.clientWidth - head.clientWidth));
    }

    function slowDownTween() {
      TweenMax.to(this.tween, 0.5, {timeScale:0});
    }

    function speedUpTween() {
      TweenMax.to(this.tween, 0.5, {timeScale:1});
    }

    // update
    TweenMax.ticker.addEventListener('tick', _.bind(function() {
      if (this.tween && !isDragging) {
        TweenMax.set(head, {x:this.tween.progress() * track.clientWidth});
      }
    }, this));
  },
  update: function(newValue, oldValue) {
    newValue.tween && (this.tween = newValue.tween);
  }
});
