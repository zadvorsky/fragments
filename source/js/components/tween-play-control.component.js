Vue.component('tween-play-control', {
  props: [
    'tween'
  ],
  data: function() {
    return {
      isPaused: false
    }
  },
  methods: {
    toggle: function() {
      if (this.tween) {
        this.tween.paused(!this.tween.paused());
        this.isPaused = this.tween.paused();
      }
    }
  }
});
