const router = require("express").Router()

router.use("/v1/api/user", require("./users"))

module.exports = router