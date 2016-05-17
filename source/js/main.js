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
  var loader = new THREELoader(function() {
    Vue.use(VueRouter);

    var router = new VueRouter();
    var items = [
      {name: '00'}, // view: IntroView
      {name: '01'},
      {name: '02'},
      {name: '03'}
    ];

    items.forEach(function(item) {
      router.on('/' + item.name, {
        component: (item.view || GalleryItemView).extend({
          data: function(){
            return {
              item: item,
              assets: loader
            };
          }
        })
      });
    });

    router.redirect({
      '*': '/00'
    });

    router.start({
      data: function() {
        return {
          items: items
        }
      }
    }, '#app');
  });

  loader.loadFont('main_font', 'res/fonts/droid_sans_bold.typeface.js');
})();
