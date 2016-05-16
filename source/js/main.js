//=require ../vendor/**/*.js

//=require three/*.js
//=require objects/*.js
//=require controllers/*.js
//=require views/*.js
//=require utils.js

(function() {
  var loader = new THREELoader(function() {

  });

  loader.loadFont('main_font', 'res/fonts/droid_sans_bold.typeface.js');
})();
