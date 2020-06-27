const path = require("path").resolve(__dirname).replace(appRoot, "");
const router = express.Router();
const Config = require("../../config/config");
const db = require("../../model/index");
const { compare, generateJWT } = require("../../utils/index");
const Users = db.users;
router.post(path + "/", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw Error("data not found");
    }
    const findUser = await Users.findOne({
      where: {
        username: username,
      },
    }).then((result) => result);
    if (!findUser) {
      throw Error("ไม่พบ username ในระบบ");
    }
    if (!compare(findUser.password, password)) {
      throw Error("password ไม่ถูกต้อง");
    }
    const token = generateJWT({ username });

    res.json({ ...Config.RESPONSE_SUCCESS, data: { token } });
    return;
  } catch (e) {
    res.json({ ...Config.RESPONSE_ERROR, message: e.message });
    return;
  }
});
module.exports = router;
