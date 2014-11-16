(function(){"use strict";angular.module("wtjApp",["ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","ngGrid","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){return b.otherwise("/"),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status&&(d.path("/login"),c.remove("token")),b.reject(a)}}}]).run(["$rootScope","$location","Auth",function(a,b,c){return a.$on("$stateChangeStart",function(a,d){return c.isLoggedInAsync(function(a){return d.authenticate&&!a?b.path("/login"):void 0})})}])}).call(this),function(){"use strict";angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("LoginCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){return a.user={},a.errors={},a.login=function(d){return a.submitted=!0,d.$valid?b.login({email:a.user.email,password:a.user.password}).then(function(){return c.path("/")})["catch"](function(b){return a.errors.other=b.message}):void 0},a.loginOauth=function(a){return d.location.href="/auth/"+a}}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){return a.errors={},a.changePassword=function(b){return a.submitted=!0,b.$valid?c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){return a.message="Password successfully changed."})["catch"](function(){return b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""}):void 0}}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("SignupCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){return a.user={},a.errors={},a.register=function(d){return a.submitted=!0,d.$valid?b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){return c.path("/")})["catch"](function(b){return b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){return d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})}):void 0},a.loginOauth=function(a){return d.location.href="/auth/"+a}}])}.call(this),function(){"use strict";angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("wtjApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){return b.get("/api/users").success(function(b){return a.users=b}),a["delete"]=function(b){return d.remove({id:b._id}),_.remove(a.users,b)}}])}.call(this),function(){"use strict";var a;angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("lists",{url:"/lists?category",templateUrl:"app/lists/lists.html",controller:"ListsCtrl"}),a.state("list",{url:"/lists/:id",templateUrl:"app/lists/list.html",controller:"ListCtrl"})}]),a=function(a,b){var c,d;return c=new Date(a),d=new Date(b),c-d},angular.module("wtjApp").controller("ListsCtrl",["$scope","$state","List","Category","listService",function(b,c,d,e,f){var g;return b.title="Lists",g={},c.params.category&&(g.category=c.params.category,e.get({id:c.params.category},function(a){return b.title="Lists Matching "+a.name})),b.lists=d.query(g,function(a){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++)b=a[c],e.push(f.decorate(b));return e}),b.gridOptions={data:"lists",enableRowSelection:!1,enableCellSelection:!1,sortInfo:{fields:["updatedAt"],directions:["desc"]},columnDefs:[{field:"title",displayName:"Title",cellTemplate:"app/lists/title-cell-link.html",sortable:!0},{field:"datePretty",displayName:"Updated",sortable:!0,sortFn:a},{field:"categories",displayName:"Categories",cellTemplate:"app/lists/categories-cell.html",sortable:!1}]},b.goToListForCategory=function(a){return c.go("lists",{category:a})}}]).controller("ListCtrl",["$scope","List","$state","listService",function(a,b,c,d){return a.list=b.get({id:c.params.id},function(a){return d.decorate(a)})}])}.call(this),function(){"use strict";angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("wtjApp").controller("MainCtrl",["$scope","Category","List",function(a,b,c){return a.categories=b.query(),a.lists=c.query({top:3})}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g;return g=e.get("token")?d.get():{},{login:function(a,b){var h;return h=f.defer(),c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),h.resolve(a),"function"==typeof b?b():void 0}).error(function(a){return function(c){return a.logout(),h.reject(c),"function"==typeof b?b(c):void 0}}(this)),h.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){return d.save(a,function(c){return e.put("token",c.token),g=d.get(),"function"==typeof b?b(a):void 0},function(a){return function(c){return a.logout(),"function"==typeof b?b(c):void 0}}(this)).$promise},changePassword:function(a,b,c){return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return"function"==typeof c?c(a):void 0},function(a){return"function"==typeof c?c(a):void 0}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){return g.hasOwnProperty("$promise")?g.$promise.then(function(){"function"==typeof a&&a(!0)})["catch"](function(){"function"==typeof a&&a(!1)}):"function"==typeof a?a(g.hasOwnProperty("role")):void 0},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}])}.call(this),function(){"use strict";angular.module("wtjApp").service("listService",["$q",function(a){var b;return b={decorate:function(b){if(!b)throw"listService.decorate(): null argument";return b.$promise||(b.$promise=a.when(b)),b.$promise.then(function(a){var b;return b=new Date(a.updatedAt),a.datePretty=b.toDateString()}),b}}}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Modal",["$rootScope","$modal",function(a,b){var c;return c=function(c,d){var e;return e=a.$new(),c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})},{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d,e;b=Array.prototype.slice.call(arguments),e=b.shift(),d=void 0,d=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){d.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){d.dismiss(a)}}]}},"modal-danger"),d.result.then(function(c){a.apply(c,b)})}}}}}])}.call(this),function(){"use strict";angular.module("wtjApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){return b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}})}.call(this),function(){"use strict";angular.module("wtjApp").controller("NavbarCtrl",["$scope","$location","Auth",function(a,b,c){return a.menu=[{title:"Home",link:"/"}],a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.logout=function(){return c.logout(),b.path("/login")},a.isActive=function(a){return a===b.path()}}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Category",["$resource",function(a){return a("/api/categories/:id/:controller",{id:"@_id"},{update:{method:"PUT"}})}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("List",["$resource",function(a){return a("/api/lists/:id/:controller",{id:"@_id"},{update:{method:"PUT"}})}])}.call(this),function(){"use strict";angular.module("socketMock",[]).factory("socket",function(){return{socket:{connect:function(){},on:function(){},emit:function(){},receive:function(){}},syncUpdates:function(){},unsyncUpdates:function(){}}}),angular.module("wtjApp").factory("socket",["socketFactory",function(a){var b,c;return b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b}),{socket:c,syncUpdates:function(a,b,d){return c.on(a+":save",function(a){var c,e,f;return f=_.find(b,{_id:a._id}),e=b.indexOf(f),c="created",f?(b.splice(e,1,a),c="updated"):b.push(a),"function"==typeof d?d(c,a,b):void 0}),c.on(a+":remove",function(a){var c;return c="deleted",_.remove(b,{_id:a._id}),"function"==typeof d?d(c,a,b):void 0})},unsyncUpdates:function(a){return c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}])}.call(this),angular.module("wtjApp").factory("socket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}]),angular.module("wtjApp").run(["$templateCache",function(a){"use strict";a.put("app/lists/categories-cell.html","<div class=ngCellText ng-class=col.colIndex()><span ng-cell-text><span ng-repeat=\"cat in row.getProperty('categories')\"><button ng-click=goToListForCategory(cat._id)>{{ cat.name }}</button></span></span></div>"),a.put("app/lists/title-cell-link.html",'<div class=ngCellText ng-class=col.colIndex()><span ng-cell-text><a ui-sref="list({ id: row.getProperty(\'_id\') })">{{row.getProperty("title")}}</a></span></div>')}]),angular.module("wtjApp").run(["$templateCache",function(a){"use strict";a.put("app/account/login/login.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from<code>server/config/seed.js</code>. Default account is<code>test@test.com</code>/<code>test</code></p><p>Admin account is<code>admin@admin.com</code>/<code>admin</code></p></div><div class=col-sm-12><form name=form ng-submit=login(form) novalidate class=form><div class=form-group><label>Email</label><input name=email ng-model=user.email class="form-control"></div><div class=form-group><label>Password</label><input type=password name=password ng-model=user.password class="form-control"></div><div class="form-group has-error"><p ng-show="form.email.$error.required &amp;&amp; form.password.$error.required &amp;&amp; submitted" class=help-block>Please enter your email and password.</p><p class=help-block>{{ errors.other }}</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-login">Login</button> <a href=/signup class="btn btn-default btn-lg btn-register">Register</a></div><hr><div><a href="" ng-click=loginOauth(&quot;facebook&quot;) class="btn btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a href="" ng-click=loginOauth(&quot;google&quot;) class="btn btn-google-plus"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a href="" ng-click=loginOauth(&quot;twitter&quot;) class="btn btn-twitter"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form name=form ng-submit=changePassword(form) novalidate class=form><div class=form-group><label>Current Password</label><input type=password name=password ng-model=user.oldPassword mongoose-error="" class="form-control"><p ng-show=form.password.$error.mongoose class=help-block>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword ng-model=user.newPassword ng-minlength=3 required class="form-control"><p ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) &amp;&amp; (form.newPassword.$dirty || submitted)" class=help-block>Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button type=submit class="btn btn-lg btn-primary">Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form name=form ng-submit=register(form) novalidate class=form><div ng-class="{ &quot;has-success&quot;: form.name.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.name.$invalid &amp;&amp; submitted }" class=form-group><label>Name</label><input name=name ng-model=user.name required class="form-control"><p ng-show="form.name.$error.required &amp;&amp; submitted" class=help-block>A name is required</p></div><div ng-class="{ &quot;has-success&quot;: form.email.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.email.$invalid &amp;&amp; submitted }" class=form-group><label>Email</label><input type=email name=email ng-model=user.email required mongoose-error="" class="form-control"><p ng-show="form.email.$error.email &amp;&amp; submitted" class=help-block>Doesn\'t look like a valid email.</p><p ng-show="form.email.$error.required &amp;&amp; submitted" class=help-block>What\'s your email address?</p><p ng-show=form.email.$error.mongoose class=help-block>{{ errors.email }}</p></div><div ng-class="{ &quot;has-success&quot;: form.password.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.password.$invalid &amp;&amp; submitted }" class=form-group><label>Password</label><input type=password name=password ng-model=user.password ng-minlength=3 required mongoose-error="" class="form-control"><p ng-show="(form.password.$error.minlength || form.password.$error.required) &amp;&amp; submitted" class=help-block>Password must be at least 3 characters.</p><p ng-show=form.password.$error.mongoose class=help-block>{{ errors.password }}</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-login">Sign up</button> <a href=/login class="btn btn-default btn-lg btn-register">Login</a></div><hr><div><a href="" ng-click=loginOauth(&quot;facebook&quot;) class="btn btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a href="" ng-click=loginOauth(&quot;google&quot;) class="btn btn-google-plus"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a href="" ng-click=loginOauth(&quot;twitter&quot;) class="btn btn-twitter"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li ng-repeat="user in users" class=list-group-item><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span><a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/lists/list.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><h1>{{ list.title }}</h1><div class=author>{{ list.author.name }}</div><ul class=list><li ng-repeat="item in list.items" class=item>{{ item }}</li></ul><h2>Categories</h2><div class=row><p>Categories will be clickable (to be implemented).</p><span ng-repeat="cat in list.categories"><button type=button ui-sref="lists({category: cat._id})" class="btn btn-default">{{ cat.name }}</button></span></div></div>'),a.put("app/lists/lists.html","<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><h1>{{ title }}</h1><div ng-grid=gridOptions class=gridStyle></div></div>"),a.put("app/main/main.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div ng-controller=MainCtrl class=container><h1>Top Trending Lists</h1><p>Will display top n by number of votes (to be implemented).</p><p>Each list will be clickable.</p><ul class=list><li ng-repeat="list in lists" class=item><a ui-sref="list({id: list._id})">{{ list.title }}</a></li></ul><h1>Categories</h1><div class=row><p>Categories will be clickable (to be implemented).</p><span ng-repeat="cat in categories"><button type=button ui-sref="lists({ category: cat._id })" class="btn btn-default">{{ cat.name }}</button></span></div></div><footer class=footer><div class=container><p>Angular Fullstack v2.0.13 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div></footer>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div ng-controller=NavbarCtrl class="navbar navbar-default navbar-static-top"><div class=container><div class=navbar-header><button type=button ng-click="isCollapsed = !isCollapsed" class=navbar-toggle><span class=sr-only>Toggle navigation</span><span class=icon-bar></span><span class=icon-bar></span><span class=icon-bar></span></button><a href="/" class=navbar-brand>wtj</a></div><div id=navbar-main collapse=isCollapsed class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(&quot;/admin&quot;)}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-hide=isLoggedIn() ng-class="{active: isActive(&quot;/signup&quot;)}"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(&quot;/login&quot;)}"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(&quot;/settings&quot;)}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(&quot;/logout&quot;)}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>')}]);