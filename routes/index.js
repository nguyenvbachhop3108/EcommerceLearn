const router = require("express").Router()

router.use("/v1/api/user", require("./users"))
router.use("/v1/api/product", require("./products"))

module.exports = router