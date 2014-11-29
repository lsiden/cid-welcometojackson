(function(){"use strict";angular.module("wtjApp",["ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","ui.sortable","ngGrid","angular-flash.service","angular-flash.flash-alert-directive"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){return b.otherwise("/"),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status&&(d.path("/login"),c.remove("token")),b.reject(a)}}}]).run(["$rootScope","$location","Auth",function(a,b,c){return a.$on("$stateChangeStart",function(a,d){return c.isLoggedInAsync(function(a){return d.authenticate&&!a?b.path("/login"):void 0})})}])}).call(this),function(){"use strict";angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("LoginCtrl",["$scope","$location","$state","$window","Auth","listService",function(a,b,c,d,e,f){return a.user={},a.errors={},a.login=function(b){return a.submitted=!0,b.$valid?e.login({email:a.user.email,password:a.user.password}).then(function(a){var b;return _.has(a,"token")&&(b=f.deferredVoteListId())?f.voteDeferredList(b,function(){return c.go("list",{id:b})}):c.go("main")})["catch"](function(b){return a.errors.other=b.message}):void 0},a.loginOauth=function(a){return d.location.href="/auth/"+a}}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){return a.errors={},a.changePassword=function(b){return a.submitted=!0,b.$valid?c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){return a.message="Password successfully changed."})["catch"](function(){return b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""}):void 0}}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("SignupCtrl",["$scope","$location","$state","$window","Auth","listService",function(a,b,c,d,e,f){return a.user={},a.errors={},a.register=function(b){return a.submitted=!0,b.$valid?e.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(a){var b;return _.has(a,"token")&&(b=f.deferredVoteListId())?f.voteDeferredList(b,function(){return c.go("list",{id:b})}):c.go("main")})["catch"](function(c){return c=c.data,a.errors={},angular.forEach(c.errors,function(c,d){return b[d].$setValidity("mongoose",!1),a.errors[d]=c.message})}):void 0},a.loginOauth=function(a){return d.location.href="/auth/"+a}}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("AdminAccountCtrl",["$scope","$http","flash","Modal","User",function(a,b,c,d,e){return a.users=e.query({role:"user"},function(b){var d,e,f,g;for(g=[],d=e=0,f=b.length-1;f>=0?f>=e:e>=f;d=f>=0?++e:--e)g.push(function(d){return a.$watch("users[:i].active".replace(/:i/,d),function(a,e){return a!==e?b[d].$update(function(){var e;return e=":verb account :email".replace(/:verb/,a?"Activated":"Deactivated").replace(/:email/,b[d].email),c.success=e},function(a){return c.error=a.message}):void 0})}(d));return g}),a["delete"]=function(b){var e;return e=function(){return b.$remove(function(){return _.remove(a.users,b),c.success="You have deleted :email.".replace(/:email/,b.email)},function(a){return c.error=a.message})},d.confirm["delete"](e)(b.email)}}])}.call(this),function(){"use strict";angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("admin-accounts",{url:"/admin/accounts",templateUrl:"app/admin/accounts/index.html",controller:"AdminAccountCtrl"}),a.state("admin-categories",{url:"/admin/categories",templateUrl:"app/admin/categories/index.html",controller:"AdminCategoriesIndex"}),a.state("admin-category",{url:"/admin/categories/:id",templateUrl:"app/admin/categories/edit.html",controller:"AdminCategoryEdit"})}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("AdminCategoriesIndex",["$scope","$http","$state","flash","Category","Modal",function(a,b,c,d,e,f){return a.categories=e.query(function(a){return a.sort(function(a,b){return a.name===b.name?0:a.name>b.name?1:-1})}),a["new"]=function(){return e.save(function(a){return c.go("admin-category",{id:a._id})},function(a){return d.error=a.message})},a["delete"]=function(b){var c;return c=function(){return b.$remove(function(){return _.remove(a.categories,b),d.success="You have deleted :name.".replace(/:name/,b.name)},function(a){return d.error=a.message})},f.confirm["delete"](c)(b.name)}}]).controller("AdminCategoryEdit",["$scope","$http","flash","$state","Category",function(a,b,c,d,e){return a.category_master={},a.category=e.get({id:d.params.id},function(b){return a.category_master=angular.copy(b)},function(a){return c.error=a.message}),a.isChanged=function(){return!angular.equals(a.category,a.category_master)},a.reset=function(){return a.category=angular.copy(a.category_master)},a.submit=function(b){return a.submitted=!0,b.$valid?a.category.$update(function(a){return c.success="Updated :name category.".replace(/:name/,a.name),d.go("admin-categories")},function(a){return c.error=a.message}):void 0}}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("ListEditCtrl",["$scope","$state","flash","Auth","List","Category","listService","Modal",function(a,b,c,d,e,f,g,h){return a.submitted=!1,a.message="",a.isAdmin="admin"===d.getCurrentUser().role,a.list=g.decorate({}),a.list_master=angular.copy(a.list),a.list=e.get({id:b.params.id},function(b){var c;return g.decorate(b),b.items=function(){var a,d,e,f;for(e=b.items,f=[],a=0,d=e.length;d>a;a++)c=e[a],f.push({val:c});return f}(),angular.copy(b,a.list_master)},function(a){return c.error=a.message}),a.categories=f.query(),a.isChanged=function(){return!angular.equals(a.list_master,a.list)},a.appendItem=function(){return a.list.items.push({val:""})},a.removeItem=function(b){return delete a.items[b]},a.reset=function(){return angular.copy(a.list_master,a.list)},a.submit=function(d){var e,f;return a.submitted=!0,d.$valid?(f=angular.copy(a.list),f.items=function(){var a,b,c,d;for(c=f.items,d=[],a=0,b=c.length;b>a;a++)e=c[a],d.push(e.val);return d}(),f.$update(function(){return b.go("list",{id:b.params.id})},function(a){return c.error=a.message})):void 0},a.dragControlListeners={accept:function(){return!0},containment:"#edit-list-items"},a["delete"]=function(){var d;return d=function(){return a.list.$delete(function(){return c.success="Deleted "+a.list.title,b.go("my-lists")},function(a){return c.error=a.message})},h.confirm["delete"](d)(a.list.title)}}])}.call(this),function(){"use strict";var a;a=function(a,b){var c,d;return c=new Date(a),d=new Date(b),c-d},angular.module("wtjApp").controller("ListIndexCtrl",["$scope","$state","$sce","$q","List","Category","User","Auth","listService",function(b,c,d,e,f,g,h,i,j){return b.title="Lists",b.trust=d.trustAsHtml,b.canCreate=c.is("my-lists"),function(a,d,k,l){if(c.is("my-lists")){if(!i.isLoggedIn())return void c.go("login");l.push("My Lists"),k.author=i.getCurrentUser()._id}else c.params.author&&(k.author=c.params.author,d=h.get({id:c.params.author}));return c.params.category&&(k.category=c.params.category,a=g.get({id:c.params.category})),(a||d)&&e.all({cat:a,user:d}).then(function(a){return a.cat.$resolved&&l.push(a.cat.name),a.user.$resolved?l.push(a.user.name):void 0},function(a){return flash.error="An error occured: "+a}),l.length>0&&(b.title=l.join("<br />")),c.params.featured&&(k.featured=c.params.featured),b.lists=f.query(k,function(a){var c,d,e,f;for(b.lists=j.censor(a),f=[],d=0,e=a.length;e>d;d++)c=a[d],f.push(j.decorate(c));return f})}(e.when(!1),e.when(!1),{},[]),b.newList=function(){return f.save(function(a){return{author:i.getCurrentUser()._id},c.go("list-edit",{id:a._id})},function(a){return flash.error=a.message})},b.gridOptions={data:"lists",enableRowSelection:!1,enableCellSelection:!1,sortInfo:{fields:["updatedAt"],directions:["desc"]},columnDefs:[{field:"title",displayName:"Title",cellTemplate:"app/lists/index/title-cell-link.html",sortable:!0},{field:"author",displayName:"Author",cellTemplate:"app/lists/index/author-cell-link.html",sortable:!0},{field:"updatedPretty",displayName:"Updated",sortable:!0,sortFn:a},{field:"categories",displayName:"Categories",cellTemplate:"app/lists/index/categories-cell.html",sortable:!1}]},b.goToListForCategory=function(a){return c.go("lists",{category:a})}}])}.call(this),function(){"use strict";angular.module("wtjApp").controller("ListCtrl",["$scope","$state","$modal","$http","Complaint","List","Vote","Auth","Modal","flash","listService",function(a,b,c,d,e,f,g,h,i,j,k){return a.canEdit=!1,a.canDelete=!1,a.canBlock=h.isAdmin(),a.votes=[],a.alreadyVoted=!1,a.list=f.get({id:b.params.id},function(b){var c;return k.decorate(b),c=h.getCurrentUser(),a.canEdit=b.author._id===c._id,a.canDelete="admin"===c.role||b.author._id===c._id}),a.votes=g.query({list:b.params.id},function(b){var c;return c=h.getCurrentUser(),c.$promise?c.$promise.then(function(c){var d,e,f,g;for(g=[],e=0,f=b.length;f>e;e++){if(d=b[e],d.user._id===c._id){a.alreadyVoted=!0;break}g.push(void 0)}return g}):void 0}),a.edit=function(){return b.go("list-edit",{id:b.params.id})},a.vote=function(b){return k.vote(b._id,function(b){return a.alreadyVoted=!0,b?a.votes.push(b):void 0})},a.toggleActive=function(){return a.list.active=!a.list.active,a.list.$update(function(){return j.success="List is "+(a.list.active?"published.":"blocked.")})},a["delete"]=function(){var c;return c=function(){return a.list.$remove(function(){return j.success="You have deleted your list "+a.list.title,b.go("my-lists")},function(a){return j.error=a.message})},i.confirm["delete"](c)(a.list.title)},a.complain=function(){var b;return b=c.open({templateUrl:"components/modal/complain.html",controller:function(a,b){return a.data={reason:"",email:""},a.submit=function(c){return console.log(c),b.close(a.data)}},dismissable:!0},"modal-warning"),b.result.then(function(b){return console.log(b),b.reason?e.save(_.assign(b,{list:a.list._id}),function(){return j.success="Thank you.  The site admin will be notified."},function(a){return j.error=a.message}):j.warn="You did not give a reason for your complaint.  You may try again."})}}])}.call(this),function(){"use strict";angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("lists",{url:"/lists?category&author&featured",templateUrl:"app/lists/index/index.html",controller:"ListIndexCtrl"}),a.state("my-lists",{url:"/lists/me",templateUrl:"app/lists/index/index.html",controller:"ListIndexCtrl"}),a.state("list",{url:"/lists/:id",templateUrl:"app/lists/list.html",controller:"ListCtrl"}),a.state("list-edit",{url:"/lists/:id/edit",templateUrl:"app/lists/edit/edit.html",controller:"ListEditCtrl"})}])}.call(this),function(){"use strict";angular.module("wtjApp").config(["$stateProvider",function(a){return a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("wtjApp").controller("MainCtrl",["$scope","$state","Category","List","listService",function(a,b,c,d,e){var f;return a.order="recent",a.categories=c.query(),f=function(){return a.lists=d.query({top:200,order:a.order},function(b){var c,d,f,g;for(a.lists=b.filter(function(a){return a.active}),g=[],d=0,f=b.length;f>d;d++)c=b[d],g.push(e.decorate(c));return g})},f(),a.$watch("order",function(a,b){return a!==b?f():void 0})}])}.call(this),function(){angular.module("wtjApp").directive("mailTo",function(){return{restrict:"E",scope:{name:"@",email:"@"},template:'<a href="mailto:{{email}}">{{name}}</a>'}})}.call(this),function(){"use strict";angular.module("wtjApp").service("listService",["$q","$state","$cookieStore","$sce","flash","Auth","Vote",function(a,b,c,d,e,f,g){var h;return h={censor:function(a){return f.isAdmin()?a:a.filter(function(a){return a.active||a.author._id===f.getCurrentUser()._id})},decorate:function(a){var b;if(!a)throw"listService.decorate(): null argument";return a.updatedAt||(a.updatedAt=new Date),b=new Date(a.updatedAt),a.updatedPretty=b.toDateString()+" "+b.toLocaleTimeString(),a.author||(a.author={}),a.items||(a.items=[]),a.categories||(a.categories=[]),a},vote:function(a,c){return f.isLoggedInAsync(function(d){var i;return d?(i={user:f.getCurrentUser()._id,list:a},g.query(i,function(d){var f;return d.length>0?(e.success="You have already liked this list.  We'e glad you like it so much!",b.go("list",{id:a}),"function"==typeof c?c(!1):void 0):(f=new g(i),f.$save(function(){return"function"==typeof c&&c(f),e.success="We're glad you like it!",b.go("list",{id:a})},function(a){return"function"==typeof c&&c(!1),e.error=a.message}))})):(h.deferredVoteListId(a),b.go("login"))})},deferredVoteListId:function(){var a;return a="after-login-votefor-list",arguments.length>0?arguments[0]?c.put(a,arguments[0]):c.remove(a):c.get(a)},voteDeferredList:function(a){return h.deferredVoteListId(null),h.vote(a)}}}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Modal",["$rootScope","$modal",function(a,b){var c;return c=function(c,d){var e;return e=a.$new(),c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})},{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d,e;b=Array.prototype.slice.call(arguments),e=b.shift(),d=void 0,d=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){d.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){d.dismiss(a)}}]}},"modal-danger"),d.result.then(function(c){a.apply(c,b)})}}}}}])}.call(this),function(){"use strict";angular.module("wtjApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){return b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}})}.call(this),function(){"use strict";angular.module("wtjApp").controller("NavbarCtrl",["$scope","$location","Auth",function(a,b,c){return a.menu=[{title:"Home",link:"/"},{title:"Lists",link:"/lists"},{title:"My Lists",link:"/lists/me",role:"user"}],a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.isLoggedIn=c.isLoggedIn,a.logout=function(){return c.logout(),b.path("/login"),a.isActive=function(a){return a===b.path()}}}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Auth",["$location","$rootScope","$http","$cookieStore","$q","User",function(a,b,c,d,e,f){var g;return g=d.get("token")?f.get():{},{login:function(a,b){var h;return h=e.defer(),c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return d.put("token",a.token),g=f.get(),h.resolve(a),"function"==typeof b?b(g):void 0}).error(function(a){return function(c){return a.logout(),h.reject(c),"function"==typeof b?b(c):void 0}}(this)),h.promise},logout:function(){d.remove("token"),g={}},createUser:function(a,b){return f.save(a,function(c){return d.put("token",c.token),g=f.get(),"function"==typeof b?b(a):void 0},function(a){return function(c){return a.logout(),"function"==typeof b?b(c):void 0}}(this)).$promise},changePassword:function(a,b,c){return f.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return"function"==typeof c?c(a):void 0},function(a){return"function"==typeof c?c(a):void 0}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){return g.hasOwnProperty("$promise")?g.$promise.then(function(){"function"==typeof a&&a(!0)})["catch"](function(){"function"==typeof a&&a(!1)}):"function"==typeof a?a(g.hasOwnProperty("role")):void 0},isAdmin:function(){return"admin"===g.role},getToken:function(){return d.get("token")}}}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Category",["$resource",function(a){return a("/api/categories/:id/:controller",{id:"@_id"},{update:{method:"PUT"}})}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Complaint",["$resource",function(a){return a("/api/complaints/:id/:controller",{id:"@_id"},{update:{method:"PUT"}})}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("List",["$resource",function(a){return a("/api/lists/:id/:controller",{id:"@_id"},{complain:{method:"PUT",controller:"complain"},update:{method:"PUT",controller:"update"}})}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{update:{method:"PUT"},changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}])}.call(this),function(){"use strict";angular.module("wtjApp").factory("Vote",["$resource",function(a){return a("/api/votes/:id/:controller",{id:"@_id"},{update:{method:"PUT"}})}])}.call(this),function(){"use strict";angular.module("socketMock",[]).factory("socket",function(){return{socket:{connect:function(){},on:function(){},emit:function(){},receive:function(){}},syncUpdates:function(){},unsyncUpdates:function(){}}}),angular.module("wtjApp").factory("socket",["socketFactory",function(a){var b,c;return b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b}),{socket:c,syncUpdates:function(a,b,d){return c.on(a+":save",function(a){var c,e,f;return f=_.find(b,{_id:a._id}),e=b.indexOf(f),c="created",f?(b.splice(e,1,a),c="updated"):b.push(a),"function"==typeof d?d(c,a,b):void 0}),c.on(a+":remove",function(a){var c;return c="deleted",_.remove(b,{_id:a._id}),"function"==typeof d?d(c,a,b):void 0})},unsyncUpdates:function(a){return c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}])}.call(this),angular.module("wtjApp").factory("socket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}]),angular.module("wtjApp").run(["$templateCache",function(a){"use strict";a.put("app/lists/index/author-cell-link.html",'<div class=ngCellText ng-class=col.colIndex()><span ng-cell-text><a ui-sref="lists({ author: row.getProperty(\'author._id\') })">{{row.getProperty("author.name")}}</a></span></div>'),a.put("app/lists/index/categories-cell.html","<div class=ngCellText ng-class=col.colIndex()><span ng-cell-text><span ng-repeat=\"cat in row.getProperty('categories')\"><button ng-click=goToListForCategory(cat._id)>{{ cat.name }}</button></span></span></div>"),a.put("app/lists/index/title-cell-link.html","<div class=ngCellText ng-class=col.colIndex()><span ng-cell-text><a ui-sref=\"list({ id: row.getProperty('_id') })\"><span ng-class=\"{ strike: !row.getProperty('active') }\">{{ row.getProperty(\"title\") || 'untitled' }}</span> <span class=fa ng-class=\"{ 'fa-ban': !row.getProperty('active') }\"></span></a></span></div>")}]),angular.module("wtjApp").run(["$templateCache",function(a){"use strict";a.put("app/account/login/login.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from<code>server/config/seed.js</code>. Default account is<code>test@test.com</code>/<code>test</code></p><p>Admin account is<code>admin@admin.com</code>/<code>admin</code></p></div><div class=col-sm-12><form name=form ng-submit=login(form) novalidate class=form><div class=form-group><label>Email</label><input name=email ng-model=user.email class="form-control"></div><div class=form-group><label>Password</label><input type=password name=password ng-model=user.password class="form-control"></div><div class="form-group has-error"><p ng-show="form.email.$error.required &amp;&amp; form.password.$error.required &amp;&amp; submitted" class=help-block>Please enter your email and password.</p><p class=help-block>{{ errors.other }}</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-login">Login</button> <a href=/signup class="btn btn-default btn-lg btn-register">Register</a></div><hr><div><a href="" ng-click=loginOauth(&quot;facebook&quot;) class="btn btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form name=form ng-submit=changePassword(form) novalidate class=form><div class=form-group><label>Current Password</label><input type=password name=password ng-model=user.oldPassword mongoose-error="" class="form-control"><p ng-show=form.password.$error.mongoose class=help-block>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword ng-model=user.newPassword ng-minlength=3 required class="form-control"><p ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) &amp;&amp; (form.newPassword.$dirty || submitted)" class=help-block>Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button type=submit class="btn btn-lg btn-primary">Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form name=form ng-submit=register(form) novalidate class=form><div ng-class="{ &quot;has-success&quot;: form.name.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.name.$invalid &amp;&amp; submitted }" class=form-group><label>Name</label><input name=name ng-model=user.name required class="form-control"><p ng-show="form.name.$error.required &amp;&amp; submitted" class=help-block>A name is required</p></div><div ng-class="{ &quot;has-success&quot;: form.email.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.email.$invalid &amp;&amp; submitted }" class=form-group><label>Email</label><input type=email name=email ng-model=user.email required mongoose-error="" class="form-control"><p ng-show="form.email.$error.email &amp;&amp; submitted" class=help-block>Doesn\'t look like a valid email.</p><p ng-show="form.email.$error.required &amp;&amp; submitted" class=help-block>What\'s your email address?</p><p ng-show=form.email.$error.mongoose class=help-block>{{ errors.email }}</p></div><div ng-class="{ &quot;has-success&quot;: form.password.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.password.$invalid &amp;&amp; submitted }" class=form-group><label>Password</label><input type=password name=password ng-model=user.password ng-minlength=3 required mongoose-error="" class="form-control"><p ng-show="(form.password.$error.minlength || form.password.$error.required) &amp;&amp; submitted" class=help-block>Password must be at least 3 characters.</p><p ng-show=form.password.$error.mongoose class=help-block>{{ errors.password }}</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-login">Sign up</button> <a href=/login class="btn btn-default btn-lg btn-register">Login</a></div><hr><div><a href="" ng-click=loginOauth(&quot;facebook&quot;) class="btn btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a></div></form></div></div><hr></div>'),a.put("app/admin/accounts/index.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><ul class=list-group><li ng-repeat="user in users track by $index | filter: { role: &quot;!admin&quot; } " class=list-group-item><div class=row><div class=col-sm-9><div class=row><strong>{{user.name}}</strong></div><div class=row><span class=text-muted>{{user.email}}</span></div></div><div class=col-sm-2><div class=checkbox><label><input type=checkbox ng-model=user.active name="active[]">Active</label></div></div><div class=col-sm-1><a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></div></div></li></ul></div>'),a.put("app/admin/categories/edit.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=title-bar><h1>Editing {{ category.name }}</h1></div><form name=form ng-submit=submit(form) novalidate><div class=form-group><label for=fieldName control-label=control-label>Name</label><input id=fieldName name=name ng-model=category.name required placeholder="What is the name of this category?" class="form-control"></div><div class=form-group><label for=fieldAbout control-label=control-label>About</label><textarea id=fieldAbout type=text name=about ng-model=category.about required placeholder="What is this category about?" class=form-control></textarea></div><p class=help-block>{{ message }}</p><div class="form-group buttons"><button ng-click=reset(form) ng-disabled=!isChanged(form) class="btn btn-sm btn-default">Reset</button><button type=submit ng-disabled="!isChanged(form) || form.$invalid" class="btn btn-sm btn-success">Save</button></div></form></div>'),a.put("app/admin/categories/index.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=title-bar><h1>Categories</h1><button ng-click=new() class="btn btn-primary fa fa-plus">&nbsp;New Category</button></div><ul class=list-group><li ng-repeat="category in categories track by $index" class=list-group-item><div class=row><div class=col-sm-2><a ui-sref="admin-category({ id: category._id })">{{ category.name }}</a></div><div class=col-sm-9>{{ category.about }}</div><div class=col-sm-1><a ng-click=delete(category) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></div></div></li></ul></div>'),a.put("app/lists/edit/edit.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=title-bar><h1>Editing {{ list.title }}</h1><button ng-click=delete() class="btn btn-default"><span class="fa fa-plus"></span>Delete List</button></div><form name=form role=form ng-submit=submit(form) novalidate><div class=form-group><label for=fieldTitle control-label="">Title</label><input id=fieldTitle name=name ng-model=list.title required placeholder="What is the title of this list?" class="form-control"></div><div class=form-group><label for=fieldAbout control-label="">About</label><textarea id=fieldAbout type=text name=about ng-model=list.about required placeholder="What is this list about?" class=form-control></textarea></div><div class=form-group><label for=fieldItems control-label="">Items</label><div id=fieldItems as-sortable=dragControlListeners name=items ng-model=list.items><div ng-repeat="item in list.items track by $index" as-sortable-item="" class=input-group><div as-sortable-item-handle="" class="input-group-addon fa fa-bars item-handle"></div><input ng-model="list.items[$index].val"><div ng-click=removeItem($index) class="input-group-addon fa fa-minus"></div></div></div></div><div class=form-group><label control-label=""></label><button type=button ng-click=appendItem() class="btn btn-default"><span class="fa fa-plus">&nbsp;New Item</span></button></div><div class=form-group><label for=fieldCategories control-label="">Categories</label><select id=fieldCategories multiple name=categories ng-model=list.categories ng-options="cat.name for cat in categories track by cat._id" class=form-control></select></div><div ng-show=isAdmin class=form-group><div class=checkbox><label control-label=""><input type=checkbox name=featured ng-model="list.featured">Featured</label></div></div><p class=help-block>{{ message }}</p><div class="form-group buttons"><button type=button ng-click=reset(form) ng-disabled=!isChanged(form) class="btn btn-sm btn-default">Reset</button><button type=submit ng-disabled="form.$invalid || !isChanged(form)" class="btn btn-sm btn-success">Save</button></div></form></div>'),a.put("app/lists/index/index.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=title-bar><h1 ng-bind-html=trust(title)></h1><button ng-show=canCreate ng-click=newList() class="btn btn-default"><span class="fa fa-plus"></span>New List</button></div><div ng-grid=gridOptions class=gridStyle></div></div>'),a.put("app/lists/list.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=title-bar><h1 ng-class="{ strike: !list.active }">{{ list.title }}</h1><div class=buttons><span ng-show=canEdit><button ng-click=edit() class="btn btn-primary"><span class="fa fa-pencil">&nbsp;Edit</span></button></span><span ng-show=canDelete><button ng-click=delete() class="btn btn-danger"><span class="fa fa-pencil">&nbsp;Delete</span></button></span><span ng-show=canBlock><button ng-class="{ active: !list.active }" ng-click=toggleActive() class="btn btn-warning"><span class="fa fa-ban">&nbsp;Block</span></button></span><span ng-show="!canEdit &amp;&amp; !canDelete &amp;&amp; !canBlock" title="Notify site admin of inappropriate content."><button ng-click=complain() class="btn btn-warning btn-sm"><span class="fa fa-exclamation-triangle">&nbsp;Flag</span></button></span></div></div><div class=updatedAt>{{ list.updatedPretty }}</div><div class=author><a ui-sref="lists({author: list.author._id})">{{ list.author.name }}</a></div><ol class=list><li ng-repeat="item in list.items" class=item>{{ item }}</li></ol><div class=like><h2 class=likes>Likes {{ votes.length }}</h2><button type=button ng-click=vote(list) ng-disabled=alreadyVoted class="btn btn-primary"><span class="fa fa-plus">&nbsp;Like</span></button><p ng-show=alreadyVoted>You like this list!</p></div><h2>Categories</h2><div class="row categories"><button type=button ui-sref="lists({ featured: true })" ng-show=list.featured class="btn btn-primary">Featured</button><span ng-repeat="cat in list.categories"><button type=button ui-sref="lists({category: cat._id})" class="btn btn-default">{{ cat.name }}</button></span></div></div>'),a.put("app/main/main.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><h1>Categories</h1><div class="row categories"><span class=category><button type=button ui-sref="lists({ featured: true })" class="btn btn-primary">Featured</button></span><span ng-repeat="cat in categories" class=category><button type=button ui-sref="lists({ category: cat._id })" class="btn btn-default">{{ cat.name }}</button></span></div><h1>Lists from Jackson</h1><div class="row order-by"><div class=form-group><select ng-model=order class=form-control><option value=popular>Popular</option><option value=recent>Recent</option></select></div></div><div class="row item header"><div class="col-xs-offset-6 col-xs-3">Author</div><div class=col-xs-3>Updated</div></div><div ng-repeat="list in lists" class="row item"><div class=col-xs-3><a ui-sref="list({id: list._id})">{{ list.title }}</a></div><div class=col-xs-3>{{ list.nVotes }} Likes</div><div class=col-xs-3><a ui-sref="lists({ author: list.author._id })">{{ list.author.name }}</a></div><div class=col-xs-3>{{ list.updatedPretty }}</div></div></div><footer class=footer><div class=container><p>Angular Fullstack v2.0.13 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div></footer>'),a.put("components/modal/complain.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 class=modal-title>Object to Content</h4></div><div class=modal-body><form id=complaintForm name=form role=form ng-submit=submit(form); novalidate></form><div class=form-group><label for=fieldReason control-label="">Reason</label><textarea id=fieldReason rows=3 name=reason ng-model=data.reason required placeholder="Please state your objection in 240 characters or less.  Please be concise." class=form-control></textarea></div><div class=form-group><label for=fieldEmail control-label="">Email (optional)</label><input id=fieldEmail name=email ng-model=data.email placeholder="You may provide your email if you want to be contacted." class="form-control"></div></div><div class=modal-footer><button type=button ng-click=$dismiss() class="btn btn-default btn-cancel">Cancel</button><button type=button ng-click=submit(form) ng-disabled=form.$invalid class="btn btn-sm btn-success">Save</button></div><f></f>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div ng-controller=NavbarCtrl class="navbar navbar-default navbar-static-top"><div class=container><div class=navbar-header><button type=button ng-click="isCollapsed = !isCollapsed" class=navbar-toggle><span class=sr-only>Toggle navigation</span><span class=icon-bar></span><span class=icon-bar></span><span class=icon-bar></span></button><a href="/" class=navbar-brand>wtj</a></div><div id=navbar-main collapse=isCollapsed class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}" ng-show="!item.role || isLoggedIn()"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(&quot;/admin&quot;)}" class=dropdown><a href=href class=dropdown-toggle>Admin</a><ul class=dropdown-menu><li><a ui-sref=admin-accounts>Accounts</a></li><li><a ui-sref=admin-categories>Categories</a></li></ul></li></ul><ul class="nav navbar-nav navbar-right"><li ng-hide=isLoggedIn() ng-class="{active: isActive(&quot;/signup&quot;)}"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(&quot;/login&quot;)}"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(&quot;/settings&quot;)}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(&quot;/logout&quot;)}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>')
}]);