const path = require("path").resolve(__dirname).replace(appRoot, "");
const router = express.Router();
const Config = require("../../config/config");
const db = require("../../model/index");
const { encode, generateJWT } = require("../../utils/index");
const Users = db.users;
router.post(path + "/", async (req, res) => {
  try {
    const { username, password, policy, newfeed } = req.body;
    if (!username || !password || !policy) {
      throw Error("data not found");
    }
    const findUsername = await Users.findOne({
      where: {
        username: username,
      },
    }).then((result) => result);
    if (findUsername && findUsername.username) {
      throw Error("username same");
    }
    const createUser = await Users.create({
      username: username,
      password: encode(password),
      new_feed: newfeed ? true : false,
    });
    if (!createUser.id) {
      throw Error("insert fail");
    }
    const token = generateJWT({ username });
    res.json({ ...Config.RESPONSE_SUCCESS, data: { token } });
    return;
  } catch (e) {
    res.json({ ...Config.RESPONSE_ERROR, message: "ไม่สามารถทำรายการได้" });
    return;
  }
});
module.exports = router;
