const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT } = require("../middlewares/");
const { validateFields } = require("../middlewares/");
const {
  login,
  googleSignin,
  getValidatedUser,
} = require("../controllers/auth");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is a must").isEmail(),
    check("password", "Password is a must").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "id_token is necessary").not().isEmpty(), validateFields],
  googleSignin
);

router.get("/", [validateJWT], getValidatedUser);

router.get("*", (req, res) => {
  res.json({
    msg: "ERROR 404 | Page Not Found",
  });
});

module.exports = router;
