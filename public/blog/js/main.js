/**
 * Created by dong on 2016/12/16.
 */
function G() {
    this.type = [];
    this.document = [];
    this.web = function (str, callBack) {
        var _self = this;
        if (this[str].length > 0) {
            setTimeout(function () {
                callBack(_self[str])
            }, 1)
        } else {
            $.get("/data/" + str, function (data) {
                callBack(data['list']);
                _self[str] = data['list'];
            })
        }
    }
}
G.prototype.getType = function (callBack) {
    this.web("type", callBack);
};
G.prototype.getDocument = function (callBack) {
    this.web("document", callBack);
};
var g = new G();
var app = angular.module('Blog', ["ngAnimate", "ui.router"]);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    /*首页*/
    $stateProvider.state({
        name: "index",
        url: "/index",
        views: {
            content: {
                templateUrl: "blog/component/first.html"
            }
        }
    });
    $stateProvider.state({
        name: "gaga",
        url: "/gaga/:docId",
        views: {
            detail: {
                templateUrl: "blog/component/detail.html",
                controller: "DetailCtrl"

            }
        }
    })
    $stateProvider.state({
        name: "list",
        url: "/:typeId",
        views: {
            content: {
                templateUrl: "blog/component/list.html?t=" + Math.floor(Date.now() / 1000),
                controller: "ListCtrl"

            }
        }
    })

    $urlRouterProvider.otherwise("index");

}]);

app.controller("MainCtrl", ['$scope', "$http", function ($scope, $http) {
    $scope.ifShowSonMenu = false;
    $scope.showMenu = showMenu;
    $scope.hideMenu = hideMenu;
    $scope.showSonMenu = showSonMenu;

    g.getType(function (data) {
        $scope.menuList = data;
    });

    /*点击显示子菜单*/
    function showSonMenu() {
        if ($scope.ifShowSonMenu) {
            $scope.ifShowSonMenu = false;
        } else {
            $scope.ifShowSonMenu = true;
        }
        var c = $("#caret");
        if (c.hasClass("up")) {
            c.removeClass("up");
        } else {
            c.addClass("up");
        }
    }
}]);

app.controller("ListCtrl", ['$scope', '$http', "$stateParams", function ($scope, $http, $stateParams) {
    /*获取参数，判断需要显示的响应 文档列表*/
    var typeId = $stateParams['typeId'];
    $scope.typeId = typeId;
    g.getDocument(function (data) {
        if (typeId == "all") {
            $scope.list = data;
        } else {
            $scope.list = data.filter(function (v) {
                if (v["type_id"] == typeId) {
                    return true;
                }
                return false;
            })
        }
    })
}]);

app.controller("DetailCtrl", ['$scope', '$http', "$stateParams", function ($scope, $http, $stateParams) {
    var docId = $stateParams['docId'];
    var url = "";
    g.getDocument(function (list) {
        for(var i = 1; i< list.length; i ++) {
            if(list[i]['id'] == docId) {
                url = list[i]['url']
                $scope.url = url;
                break;
            }
        }
    })
    $scope.goBack = function () {
        history.go(-1);
    }
}])

/*给“文档分类给具体的值”*/
setMyClassHeight();
function setMyClassHeight() {
    var m = $("#myClass");
}

/*显示侧边栏*/
function showMenu() {
    $("#leftMenu").addClass("show");
}
/*隐藏侧边栏*/
function hideMenu() {
    $("#leftMenu").removeClass("show");
}

$(window).resize(function () {
    hideMenu();
});