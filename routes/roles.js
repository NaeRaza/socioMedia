const router = require('express').Router();
const {createRole, updateRole, deleteRole} = require('../controllers/roles')

//Create
router.post("/create", createRole)

//Update
router.put("/update/:id", updateRole)

//delete
router.delete("/delete/:id", deleteRole)

module.exports = router