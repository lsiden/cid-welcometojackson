/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

 'use strict';

 var Thing = require('../api/thing/thing.model');
 var User = require('../api/user/user.model');
 var Category = require('../api/category/category.model');
 var List = require('../api/list/list.model');

 Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

exports.createUsers = function(n, done) {
  User.find({}).remove(function() {
    var user_params = [{
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }];
    for (var i=1 ; i <= n ; ++i) {
      user_params.push({
        provider: 'local',
        name: 'Test User ' + i,
        email: 'test:i@test.com'.replace(/:i/, i),
        password: 'test'
      });
    }
    User.create(user_params, function(err, items) {
      console.log('finished populating users');
      if (err) done(err);
      done();
    });
  });
};

exports.createCategories = function(n, done) {
  Category.find({}).remove(function() {
    var cat_params = [];
    for (var i=1 ; i <= n ; ++i) {
      cat_params.push({
        provider: 'local',
        name: 'Category ' + i,
        about: 'Category :i description goes here.'.replace(/:i/, i)
      });
    }
    Category.create(cat_params, function(err) {
      var cats = [];
      for (var k=1 ; k < arguments.length ; ++k) {
        cats.push(arguments[k]);
      }
      // console.log(cats);
      console.log('finished populating categories');
      done(err, cats);
    });
  });
};

// Return n random items from array
var pickRandom = function(ar, n) {
  var result = [];
  for (var i=0 ; i < n ; ++i) {
    var r = Math.floor(Math.random() * ar.length);
    result.push(ar[r]);
  }
  return result;
}

exports.createLists = function(n, done) {
  exports.createCategories(5, function(err) {
    var cats = arguments[1];
    // console.log(cats);
    // console.log( pickRandom(cats, 3).map(function(cat) { return cat._id }));
    List.find({}).remove(function() {
      var list_params = [];
      var items = [];
      for (var i=1 ; i <= 12 ; ++i) {
        items.push('item ' + i)
      }
      for (var k=1 ; k <= 12 ; ++k) {
        list_params.push({
          provider: 'local',
          title: 'List ' + k,
          about: 'List :k description goes here.'.replace(/:k/, k),
          categories: pickRandom(cats, 3).map(function(cat) { return cat._id }),
          items: items
        });
      }
      List.create(list_params, function(err) {
        var lists = Array.prototype.slice.call(arguments, 1);
        console.log('finished populating lists');
        done(err, lists);
      });
    });
  });
};
