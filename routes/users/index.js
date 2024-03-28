const { register } = require("../../controllers/users.controllers")

const router = require("express").Router()

router.post("/register", register )

module.exports = router