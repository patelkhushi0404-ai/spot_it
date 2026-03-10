const express = require("express")
const router = express.Router()

const {createQuery,getUserQueries} = require("../controllers/queryController")
const auth = require("../middleware/authMiddleware")

router.post("/create",auth,createQuery)
router.get("/user",auth,getUserQueries)

module.exports = router