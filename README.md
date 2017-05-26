# angularjs仿拉勾网
##安装依赖
```
npm install -g gulp
npm install
```
##运行gulp
``` 可能要安装gulp的插件，，，，，，，
gulp
```
##自动开启浏览器localhost:3000
```
localhost:3000
```
##关于此项目的总结与反思
  使用的技术栈有bower+less+angular1.x+gulp。没有涉及到后端，数据是模拟的json数据。

g  
"devDependencies": {
  "gulp": "^3.9.1",
  "gulp-clean": "^0.3.2",
  "gulp-concat": "^2.6.1",
  "gulp-connect": "^5.0.0",
  "gulp-cssmin": "^0.1.7",
  "gulp-imagemin": "^3.1.1",
  "gulp-less": "^3.3.0",
  "gulp-load-plugins": "^1.5.0",
  "gulp-plumber": "^1.1.0",
  "gulp-uglify": "^2.0.1",
  "lodash": "^4.17.4",
  "open": "^0.0.5"
}

那个gulpfils文件如下

 
 var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); // 用来加载其他的插件
var open = require('open');


var app = {
  srcPath: 'src/',   //这是我的源目录
  devPath: 'build/', //这是开发目录，便于调试
  prdPath: 'dist/', //生产部署目录
}

gulp.task('lib', function(){
  gulp.src('bower_components//.js') //使用bower安装的依赖，没配置.bowerrc
  .pipe(gulp.dest(app.devPath + 'vendor')) //移动插件位置
  .pipe(gulp.dest(app.prdPath + 'vendor'))
  .pipe($.connect.reload()) //改变后重新加载页面，以下均是
})

gulp.task('html', function() {
  gulp.src(app.srcPath + '/.html') //所有的html文件照搬到另外两个目录
  .pipe(gulp.dest(app.devPath))
  .pipe(gulp.dest(app.prdPath))
  .pipe($.connect.reload())
})

gulp.task('json', function() {
  gulp.src(app.srcPath + 'data//.json') //所有的json文件照搬到另外两个目录
  .pipe(gulp.dest(app.devPath + 'data'))
  .pipe(gulp.dest(app.prdPath + 'data'))
  .pipe($.connect.reload())
})

gulp.task('less', function() { //使用less编写的css
  gulp.src(app.srcPath + 'style/index.less') //index.less导入其他less文件
  .pipe($.plumber()) //阻止gulp插件发生错误导致进程退出并输出错误日志。
  .pipe($.less()) //less转为css
  .pipe($.autoprefixer()) //自动添加浏览器前缀
  .pipe(gulp.dest(app.devPath + 'css'))
  .pipe($.cssmin()) //压缩css
  .pipe(gulp.dest(app.prdPath + 'css')) 
  .pipe($.connect.reload())
})

gulp.task('js', function() {
  gulp.src(app.srcPath + 'script//.js')
  .pipe($.plumber()) //阻止gulp插件发生错误导致进程退出并输出错误日志。
  .pipe($.concat('index.js')) //全部打包为index.js
  .pipe(gulp.dest(app.devPath + 'js'))
  .pipe($.uglify())// 混淆（丑化）js
  .pipe(gulp.dest(app.prdPath + 'js'))
  .pipe($.connect.reload())
})

gulp.task('image', function() {
  gulp.src(app.srcPath + 'image//')
  .pipe(gulp.dest(app.devPath + 'image'))
  .pipe($.imagemin()) // 这个插件可能会出问题，要删掉后使用npm重新安装
  .pipe(gulp.dest(app.prdPath + 'image'))
  .pipe($.connect.reload())
})

gulp.task('build', ['image', 'js', 'less', 'lib', 'html', 'json']); //任务依赖

gulp.task('clean', function() { //这个任务清除文件夹
  gulp.src([app.devPath, app.prdPath])
  .pipe($.clean());
});

gulp.task('serve', ['build'], function() {
  $.connect.server({ //开一个服务器
    root: [app.devPath],
    livereload: true,
    port: 3000
  });

  open('http://localhost:3000'); //自动打开浏览器

  gulp.watch('bower_components//', ['lib']);
  gulp.watch(app.srcPath + '/.html', ['html']);
  gulp.watch(app.srcPath + 'data//.json', ['json']);
  gulp.watch(app.srcPath + 'style//.less', ['less']);
  gulp.watch(app.srcPath + 'script//.js', ['js']);
  gulp.watch(app.srcPath + 'image//', ['image']);
});

gulp.task('default', ['serve']);

 

 上面就是我在项目中使用的一些gulp插件。下面还有我喜欢的：
gulp.spritesmithgulp多张图片自动合成雪碧图 
用于合成雪碧图。
/引入gulp
var gulp=require("gulp"),
    spritesmith=require('gulp.spritesmith');

gulp.task('default', function () {
    return gulp.src('images/.png')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'sprite.png',//保存合并后图片的地址
            cssName: 'css/sprite.css',//保存合并后对于css样式的地址
            padding:5,//合并时两个图片的间距
            algorithm: 'binary-tree',//注释1
            cssTemplate:"css/handlebarsStr.css"//注释2
        }))
        .pipe(gulp.dest('dist/'));
});
less关于less部分，只使用了一些最基础的语法。如下：

 文件引用

使用@import。
@import 'a.less';
@import 'b.less';

 定义变量

使用的了一个文件variabel.less专门用来定义变量。在less中定义变量使用@。定义完成后以分号结束。
@defaultColor: #fff;
@defaultWidth: 400px;
这样在其他文件里，这要引入了这个文件，就可以使用这些变量。
@import 'variable.less';
body {
  color: @defaultColor;
}.box {
  width: @defaultWidth;
}

 7


 样式的嵌套

&表示引用自己。
body {
  color: @defaultColor;
  .box {
    background: red;
    &:hover {
      background: green;
    }
  }
}


  unit函数

该函数用来删除或更换单位。
参数：

1. dimension: 带单位或不带单位的数字。
2. unit: (可选) 目标单位，如果省略此参数，则删除单位。

案例： unit(5, px)

输出： 5px

案例： unit(5em)

输出： 5


 函数
定义一个函数，如下：

.pt(@px) {
  padding-top: unit(@px / 37.5, rem);
}

 


在使用的使用调用这个并传入参数即可。
.box {
  .pt(20);
}

 1
 


angular部分angular使用的插件有：

 angular-ui-router
 angular-validation
 angular-cookie
 angular-animate

// app.js
angular.module('app', ['ui.router', 'ngCookies', 'validation', 'ngAnimate'])


在ui-router中，首先是定义路由，如下：angular.module('app')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('main', { // main是当前页面的id，以后要跳转到该页面使用ui-sref="main"或者$state.go('main');
    url: '/main',
    templateUrl: 'view/mian.html',
    controller: 'mainCtrl'
  })
  .state('login', {
    // 定义其他路由等
  })

  // 除了上述路由外，处理其他不匹配的路由
  $urlRouterProvider.otherwise('main');
}])

 1
 15

ui-sref使用ui-router自带的ui-sref属性来定义将要跳转的页面的id。
<li ui-sref="main">跳转到main页面</li>

 1


 1


如果要传入参数，如下格式。（）中的对象反映的是传入的参数键值对。   没有使用$state.go()
<li ui-sref="position({id: item.id})">跳转到position页面</li>

 1


在position页面对应的控制器中，通过$state.params.id取得查询键。
angular.module('app')
.controller('positionCtrl', ['$http', '$state', '$scope', function($http, $state, $scope) {
  $http.get('data/position.json', {
    params: {
      id: $state.params.id
    }
  })
  .then(function() {}, function() {})
}])

 
可以通过ui-sref-active给选中的标签添加样式。比如菜单栏。
指令中的scope

自定义指令
//headBar.js
angular.module('app')
.directive('appHeadBar', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/headBar.html',
    scope: {
      text: '@',
    },
    link: function(scope, element, attr) {
      scope.back = function() {
        window.history.back(); // 调用浏览器的api实现后退功能
      }
    }
  }
})


 


/ 指令对应的模板页面
headBar.html
<div class="head ta-c p-r">
<span class="p-a c-w back-btn" ng-click="back();">&lt;</span>// 绑定点击函数，在指令link函数中实现

<span class="c-w" ng-bind="text"></span></div>
$index/$last在使用ng-repeat渲染元素时，可以使用两个内置的属性观察渲染情况。$scope.$index来查看渲染的子元素的索引，$scope.$last（boolean）来查看是否执行完成，如果是true，表示ng-repeat执行完毕。
<button ng-click="showPositionList($index)" ng-repeat="cls in com.positionClass" ng-bind="cls.name"></button>

 1

这个类似于导航栏的按钮，点击后控制器拿到这个$index，根据不同的$index传递给view层不同的数据。

$id/$parent$root
定于全局变量   
在任何一个控制器中，通过$scope.$id，$scope.$parent，$scope.$root来表示当前作用域的id，父作用域，根作用域。
通常在angular应用的run方法中定义根作用域相关属性。
angular.module('app',[]) // 必须引入ng-route//config方法在整个页面中最先执行，先于run，
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // 在这里配置路由
}])
// 通常将路由事件定义在根作用域下
.run(function($rootScope) {//console.log($rootScope);
  $rootScope.$on('$routeChangeStart', function () {
    console.log(this)
    console.log(arguments);
  })
})


value()和constant()使用constant()来保存一个常量。
使用value()函数来缓存全局变量（需要的时候可以直接使用）。
constant()和value()方法之间一个最主要的区别是，常量可以注入到配置函数（.config()）中，而值不行。
angular.module('app')
.constant('apikey', 'real')

 1
 2


 1
 2

angular.module('app')
.value('dict', {}) // 缓存全局变量
.run(['dict', '$http', function(dict, $http) {
  $http.get('data/city.json').then(function(res) {
    dict.city = res.data;
  })
  $http.get('data/salary.json').then(function(res) {
    dict.salary = res.data;
  })
  $http.get('data/scale.json').then(function(res) {
    dict.scale = res.data;
  })
}])


自定义过滤器<!--过滤item--><li ng-repeat="item in data | filterByObj:filterObj">

 1
 2


 1
 2

filterByObj是一个已经定义好的过滤器。它返回的函数中有两个参数，第一个list表示上述的data，第二个obj表示filterByObj:后面的filterObj。这个filterObj对应父作用域的一个属性，根据情况而改变。从而达到筛选效果。
angular.module('app')
.filter('filterByObj', [function() {
  return function(list, obj) {
      var result = [];
      angular.forEach(list, function(item) {
        var isEqual = true;
        for(var e in obj) {
          if(item[e] !== obj[e]) {
            isEqual = false;            
          }
        }
        if(isEqual) {
          result.push(item);
        }
      })

      return result;
  }
}])


 

$intervalvar interval = $interval(fn, timedelay)
$inteval.cancel(interval); // 使用cancel取消这个定时器// 在原生js中是interval = null;

 1
 2
 3


 1
 2
 3

阻止冒泡ng-click事件有一个事件对象$event。stopPropagation不需要加括号。
<li ng-click="$event.stopPropagation;select(item);"></li>

 1


 1

$watch如果在指令中用到了某个属性，但是这个属性的值依赖于异步返回的结果，这时候就需要$watch这个值。否则报错。
// 1 父作用域
<div app-company com="company"></div>
// 这是副作用域控制器执行的$http.get('data/company.json?id='+id).then(function(res){
  $scope.company = res.data;
})

// 2
angular.module('app')
.directive('appPositionClass', [function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'view/template/positionClass.html',
    scope: {
      com: '='
    },

    link: function($scope, element, attr) {
      $scope.$watch('com', function(newVal, oldVal, scope) {
        if(newVal){
          $scope.showPositionList(0);
        }
      })
    }
  }
}])


 

可以看到指令要想获得com属性，依赖于父作用域的$scope.company。而通过一个异步操作才能返回。所以指令中就$watch这个变量。
angular-validation首先在index.html页面中引入angular-validation.js，然后再angular.module(‘app’, [‘validation’])加上依赖。
这个插件定义了一个$validationProvider服务。用来设置表达式和验证消息。
// validation.js
angular.module('app')
.config(['$validationProvider', function($validationProvider) {
  var expression = {
    phone: /^1\d{10}$/,
    password: function(value) {
      return value.length > 5;
    },
    required: function(value) {
      return !!value;
    }
  }
  var defaultMsg = {
    phone: {
      success: '',
      error: '11位手机号'
    },
    password: {
      success: '',
      error: '长度至少6位'
    },
    required: {
      success: '',
      error: '不能为空'
    }
  }

  $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}])


 

在login页面中，做了简单的验证。
<div class="login">
  <form class="d-b ta-c" name="form">
    <div class="form-line ta-l p-r">
      <span class="icon account va-t d-ib"></span>
      <input name="phone" validator="required,phone" ng-model="user.phone" class="d-ib" type="text" placeholder="输入手机号">
    </div>
    <div class="form-line ta-l p-r">
      <span class="icon lock va-t d-ib"></span>
      <input name="password" validator="required,password" ng-model="user.password" class="d-ib" type="password" placeholder="输入密码">
    </div>
    <button class="login-btn" validation-submit="form" ng-click="submit();">登录</button>
    <button class="register-btn" ui-sref="register">注册</button>
  </form>
</div>


注意input的validator属性，这里是验证的表达式的内容，如果有多个，使用逗号隔开。这个内容对应validation.js中的var expression中的键。
注意<button validation-submit="form" ng-click="submit"></button>这里，form是表单的name属性。
factory/service我们使用factory或者service定义服务。service使用this来保存服务内容，类似构造函数。而factory使用返回值来保存服务内容。我们定义了一个cache服务。$cookies是angular-cookies插件提供的。两种写法如下：
// app.js中
angular.module('app', ['ui.router', 'ngCookies', 'validation', 'ngAnimate']);


服务：
angular.module('app')
.service('cache', ['$cookies', function($cookies) {
  this.put = function(key, value) {
    $cookies.put(key, value);
  };
  this.get = function(key) {
    return $cookies.get(key);
  };
  this.remove = function(key) {
    return $cookies.remove(key);
  }
}])

 
angular.module('app')
.factory('cache', ['$cookies', function($cookies) {
  return {
    put: function(key, value) {
      $cookies.put(key, value);
    },
    get: function(key) {
      return $cookies.get(key);
    },
    remove: function(key) {
      return $cookies.remove(key);
    }
  }
}])


讲真，我觉得使用这个不如使用localStorage，简单快捷（涉及到sessionID用cookie？）。
装饰器装饰器是非常强大的，它不仅可以应用在我们的我们自己的服务上，也可以对AngularJS的核心服务进行拦截、中断甚至替换功能的操作。事实上AngularJS中很多功能的测试就是借助$provide.decorator()建立的。
由于这个项目没有后端，为了模拟post请求，我们需要修改$http内置的post请求。
angular.module('app')
.config(['$provide', function($provide) {
  $provide.decorator('$http', ['$delegate', '$q', function($delegate, $q) {
    $delegate.post = function(url, data, config) {
      var def = $q.defer();
      $delegate.get(url).then(function(res) {
        def.resolve(res.data);
      }, function(err) {
        def.reject(err);
      })

      return {
        success: function(cb) {
          def.promise.then(cb);
        },
        error: function(cb) {
          def.promise.then(null, cb);
        }
      }
    }

    return $delegate;
  }])
}]) 15
 

decorator()函数可以接受两个参数。

 name （字符串）将要拦截的服务名称
 decoratorFn（函数）在服务实例化时调用该函数，这个函数由injector.invoke调用，可以将服务注入这个函数中。

$delegate是可以进行装饰的最原始的服务，为了装饰其他服务，需要将其注入进装饰器。
$q内置的$q服务用来在Angular中创建promise。如上所述，我们使用$q.deffer()创建一个延迟对象def。通常返回时通过return def.promise得到一个promise对象。这里更进一步封装了。
上述的def使用了两种方法，分别是：

 def.resolve(data)
 def.reject(err)
 def.notify(data) 上述未提到

如果返回值是def.promise，它的then方法有三个参数。
var promise = $http.post(someurl);
promise.then(function(data) {
  alert('success');
}, funciton(err) {
  alert('failed');
}, function(dataUpdate) {
  alert('update')
})


更加详细的在：
浅谈Angular的 $q, defer, promise
总结github地址
晚上花了几个小时写了总结，学完这个项目之后，确实学到了很多。在写博客的过程中，为了表述完全，又特定找了一些资料，看以前的代码。更加深了理解。

从今以后，每写一个项目都要做一次总结。

