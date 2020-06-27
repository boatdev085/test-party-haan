const path = require("path").resolve(__dirname).replace(appRoot, "");
const router = express.Router();

router.get(path + "/", async (req, res) => {
  res.status(200).json({
    boat: "123",
  });
});

module.exports = router;
