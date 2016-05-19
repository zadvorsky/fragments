//=require ../vendor/**/*.js

//=require three/*.js
//=require objects/*.js
//=require controllers/*.js

//=require scenes/scene.init.js
//=require scenes/*.js

//=require directives/*.js

//=require views/gallery-item.view.js
//=require views/*.js

//=require utils.js

// override
THREE.ShapeUtils.triangulateShape = (function () {
  var pnlTriangulator = new PNLTRI.Triangulator();
  return function triangulateShape(contour, holes) {
    return pnlTriangulator.triangulate_polygon([contour].concat(holes));
  };
})();

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
          items: items,
          active_tween: null
        }
      }
    }, '#app');
  });

  loader.loadFont('droid_sans_bold', 'res/fonts/droid_sans_bold.typeface.js');
})();
