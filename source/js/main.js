//=require ../vendor/**/*.js

//=require three/*.js
//=require objects/*.js
//=require controllers/*.js

//=require scenes/scene.init.js
//=require scenes/*.js

//=require views/gallery-item.view.js
//=require views/*.js

//=require utils.js

(function() {
  function load() {
    var loader = new THREELoader(function() {
      initVue();
    });

    loader.loadFont('main_font', 'res/fonts/droid_sans_bold.typeface.js');
  }

  function initVue() {
    Vue.use(VueRouter);

    var scenes = [
      {name: '00'}, // view: IntroView
      {name: '01'},
      {name: '02'},
      {name: '03'}
    ];

    var router = new VueRouter();

    scenes.forEach(function(scene) {
      router.on('/' + scene.name, {
        component: (scene.view || GalleryItemView).extend({
          data: function(){
            return scene;
          }
        })
      });
    });

    router.start({
      data: function() {
        return {
          scenes: scenes
        }
      }
    }, '#app');
  }

  load();
})();
