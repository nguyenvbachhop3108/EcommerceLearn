const router = require("express").Router()

router.use("/v1/api/user", require("./users"))
router.use("/v1/api/brand", require("./brand"))
router.use("/v1/api/product", require("./products"))
router.use("/v1/api/productcategory", require("./productCategory"))
router.use("/v1/api/blogcategory", require("./BlogCategory"))
router.use("/v1/api/blog", require("./Blog"))

module.exports = router