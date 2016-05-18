var GalleryItemView = Vue.extend({
  created: function() {
    console.log('view created', this.item.name);

    this.threeScene = new window.scenes[this.item.name](this.assets);
  },
  ready: function() {
    console.log('view ready', this.item.name);
  },
  destroyed: function() {
    console.log('view destroyed', this.item.name);
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
    },
    canReuse: false
  }
});
