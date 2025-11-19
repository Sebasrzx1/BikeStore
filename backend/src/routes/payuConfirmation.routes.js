const express = require("express");
const router = express.Router();
const PayuConfirmationController = require("../controllers/payuConfirmation.controller");

router.post("/", express.urlencoded({ extended: true }), PayuConfirmationController.confirmation);

module.exports = router;
