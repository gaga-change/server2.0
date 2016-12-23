/**
 * Created by dong on 2016/12/16.
 */
var typeArr = ["1","2","3","4","5"];
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
    /*所有文档*/
    $stateProvider.state({
        name: "all",
        url: "/all",
        views: {
            content: {
                templateUrl: "blog/component/list.html",
                controller: "ListCtrl"
            }
        },
        params: {id: "all"}
    });
    /*各种文档*/
    typeArr.forEach(function (v) {
        $stateProvider.state({
            name: v,
            url: "/" + v,
            views: {
                content: {
                    templateUrl: "blog/component/list.html",
                    controller: "ListCtrl"
                }
            },
            params: {id: v}
        });
    });
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
        console.log("fds");
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
    var typeId = $stateParams.id;
    g.getDocument(function (data) {
        console.log(data);
        if (typeId == "all") {
            $scope.list = data;
        } else {
            $scope.list = data.filter(function (v) {
                console.log(v);
                if (v["type_id"] == typeId) {
                    return true;
                }
                return false;
            })
        }
    })
}]);

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