var GalleryItemView = Vue.extend({
  created: function() {
    console.log('view created', this.name);
    this.threeScene = new window.scenes[this.name]();
  },
  ready: function() {
    console.log('view ready', this.name);
  },
  destroyed: function() {
    console.log('view destroyed', this.name);
  },
  route: {
    deactivate: function(transition) {
      var tl = new TimelineMax();
      var $root = this.$root;
      var scene = this.threeScene.group;

      tl.add(this.threeScene.hide());
      tl.add(function() {
        $root.$emit('scene_exit', {scene: scene});
        transition.next();
      });

      //this.$root.$emit('scene_exit', {scene:this.threeScene.group});
      //transition.next();
    },
    activate: function(transition) {
      var tl = new TimelineMax();
      var $root = this.$root;
      var scene = this.threeScene.group;

      tl.add(function() {
        $root.$emit('scene_enter', {scene: scene});
      });
      tl.add(this.threeScene.show());
      tl.add(function() {
        transition.next();
      });

      //this.$root.$emit('scene_enter', {scene:this.threeScene.group});
      //transition.next();
    },
    canReuse: false
  }
});
