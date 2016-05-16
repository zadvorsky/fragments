//=require ../vendor/**/*.js

//=require three/*.js
//=require objects/*.js
//=require controllers/*.js
//=require scenes/*.js
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

    var Intro = Vue.extend({});
    var Default = Vue.extend({});

    var scenes = [
      {name:'00', component:Intro},
      {name:'01'},
      {name:'02'}
    ];

    //var App = Vue.extend({
    //  data: function() {
    //    return {scenes: [
    //      {name:'00'},
    //      {name:'01'},
    //      {name:'02'}
    //    ]};
    //  }
    //});
    var router = new VueRouter();

    scenes.forEach(function(scene) {
      router.on('/' + scene.name, {
        component: scene.component || Default
      });
    });

    router.start({
      data: function() {
        return {
          scenes:scenes
        }
      }
    }, '#app')
  }

  load();
})();
