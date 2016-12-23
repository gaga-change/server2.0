/**
 * Created by dong on 2016/12/17.
 */
var express = require('express');
var path = require("path");
var router = express.Router();

/*获取类型集合*/
router.get('/type', function (req, res, next) {
    res.sendFile(path.dirname(__dirname) + "/data/type.json");
});
/*获取文档集合*/
router.get('/document', function (req, res, next) {
    res.sendFile(path.dirname(__dirname) + "/data/document.json");
});
module.exports = router;
