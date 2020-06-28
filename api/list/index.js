const path = require("path").resolve(__dirname).replace(appRoot, "");
const Config = require("../../config/config");
const moment = require("moment");
const fs = require("fs");
const router = express.Router();
const db = require("../../model/index");
const JWT = require("jsonwebtoken");
const Users = db.users;
const PartyList = db.partyList;
const PartyJoin = db.partyJoin;
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
router.get(path + "/", async (req, res) => {
  const { token } = req.query;
  let decoded = JWT.verify(token, Config.secret_key);
  if (!decoded) {
    decoded = {};
  }
  let findUser;
  if (decoded) {
    findUser = await Users.findOne({
      where: {
        username: decoded.username,
      },
    }).then((result) => result);
  }
  const getPartyList = await PartyList.findAll({
    where: {
      status: "pending",
    },
    include: [
      {
        model: PartyJoin,
        as: "joins",
        require: true,
      },
    ],
    order: [["createdAt", "DESC"]],
  }).then((partyList) => partyList);
  let newMapData = [];
  await asyncForEach(getPartyList, async (item) => {
    let isJoin = false;
    let praseNewItem = JSON.parse(JSON.stringify(item));
    const findJoin = item.joins.find((f) => f.user_id === findUser.id);
    if (findJoin) {
      isJoin = true;
    }
    newMapData.push({ ...praseNewItem, isJoin });
  });
  res.json({ ...Config.RESPONSE_SUCCESS, data: newMapData });
});
router.get(path + "/dashboard", async (req, res) => {
  try {
    const { token } = req.query;
    let decoded = JWT.verify(token, Config.secret_key);
    if (!decoded) {
      throw Error("token expired");
    }
    const findUser = await Users.findOne({
      where: {
        username: decoded.username,
      },
    }).then((result) => result);
    if (!findUser || !findUser.id) {
      throw Error("ไม่พบ user ในระบบ");
    }
    const getPartyList = await PartyList.findAll({
      where: {
        user_id: findUser.id,
      },
      include: [
        {
          model: PartyJoin,
          as: "joins",
          require: true,
        },
      ],
      order: [["createdAt", "DESC"]],
    }).then((partyList) => partyList);
    res.json({ ...Config.RESPONSE_SUCCESS, data: getPartyList });
  } catch (e) {
    res.json({ ...Config.RESPONSE_ERROR, message: e.message });
  }
});
router.get(path + "/:id", async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  let decoded = JWT.verify(token, Config.secret_key);
  if (!decoded) {
    decoded = {};
  }
  let findUser;
  if (decoded) {
    findUser = await Users.findOne({
      where: {
        username: decoded.username,
      },
    }).then((result) => result);
  }
  const getParty = await PartyList.findOne({
    where: {
      status: "pending",
    },
    include: [
      {
        model: PartyJoin,
        as: "joins",
        require: true,
      },
    ],
    order: [["createdAt", "DESC"]],
  }).then((partyList) => partyList);
  let isJoin = false;
  let praseNewItem = JSON.parse(JSON.stringify(getParty));
  const findJoin = praseNewItem.joins.find((f) => f.user_id === findUser.id);
  if (findJoin) {
    isJoin = true;
  }
  res.json({ ...Config.RESPONSE_SUCCESS, data: { ...praseNewItem, isJoin } });
});
router.post(path + "/join", async (req, res) => {
  try {
    const { token, partyId } = req.body;
    const decoded = JWT.verify(token, Config.secret_key);
    if (!decoded) {
      throw Error("token expired");
    }
    const findUser = await Users.findOne({
      where: {
        username: decoded.username,
      },
    }).then((result) => result);
    if (!findUser || !findUser.id) {
      throw Error("ไม่พบ user ในระบบ");
    }
    const findPartyList = await PartyList.findOne({
      where: {
        id: partyId,
      },
    }).then((result) => result);
    if (!findPartyList || !findPartyList.id) {
      throw Error("ไม่พบปาร์ตี้ที่คุณกำลังเข้าร่วม");
    }
    const findPartyJoin = await PartyJoin.findAll({
      where: {
        party_id: partyId,
      },
    }).then((party) => party);
    if (findPartyJoin.length >= findPartyList.people_number) {
      throw Error("ปาร์ตี้นี้เต็มแล้ว");
    }
    const yourJoin = findPartyJoin.find((f) => f.user_id === findUser.id);
    if (yourJoin) {
      throw Error("user ของคุณได้กดเข้าร่วม party นี้แล้ว");
    }
    const createPartyJoin = await PartyJoin.create({
      party_id: partyId,
      user_id: findUser.id,
      username: findUser.username,
    });
    if (!createPartyJoin.id) {
      throw Error("เข้าร่วมปาร์ตี้ไม่สำเร็จ");
    }
    res.json({ ...Config.RESPONSE_SUCCESS });
  } catch (e) {
    res.json({ ...Config.RESPONSE_ERROR, message: e.message });
  }
});
router.post(path + "/", async (req, res) => {
  try {
    const { partyName, peopleNumber, description, image, token } = req.body;
    if (!partyName || !peopleNumber) {
      throw Error("กรอกข้อมูลไม่ครบ");
    }
    const decoded = JWT.verify(token, Config.secret_key);
    if (!decoded) {
      throw Error("token expired");
    }
    const findUser = await Users.findOne({
      where: {
        username: decoded.username,
      },
    }).then((result) => result);
    if (!findUser || !findUser.id) {
      throw Error("ไม่พบ user ในระบบ");
    }
    let pathImage = null;
    if (image && image.length > 0) {
      pathImage = `static/image-party-list/${`image-list-party${moment().format(
        "DDMMYYYYHHmmss"
      )}.png`}`;
      const base64Data = image[0].replace(/^data:image\/png;base64,/, "");

      await fs.writeFile(pathImage, base64Data, "base64", function (err) {
        pathImage = null;
      });
    }
    const createParty = await await PartyList.create({
      user_id: findUser.id,
      party_name: partyName,
      people_number: peopleNumber,
      description: description,
      image: pathImage,
      status: "pending",
    });
    if (!createParty.id) {
      throw Error("insert fail");
    }
    const createPartyJoin = await PartyJoin.create({
      party_id: createParty.id,
      user_id: findUser.id,
      username: findUser.username,
    });
    if (!createPartyJoin.id) {
      throw Error("insert fail");
    }
    res.json({ ...Config.RESPONSE_SUCCESS, data: { id: createParty.id } });
  } catch (e) {
    res.json({ ...Config.RESPONSE_ERROR, message: e.message });
  }
});
router.post(path + "/edit", async (req, res) => {
  try {
    const {
      partyName,
      peopleNumber,
      description,
      image,
      token,
      partyId,
    } = req.body;
    console.log("req.body", req.body);
    if (!partyName || !peopleNumber) {
      throw Error("กรอกข้อมูลไม่ครบ");
    }
    const decoded = JWT.verify(token, Config.secret_key);
    if (!decoded) {
      throw Error("token expired");
    }
    const findUser = await Users.findOne({
      where: {
        username: decoded.username,
      },
    }).then((result) => result);
    if (!findUser || !findUser.id) {
      throw Error("ไม่พบ user ในระบบ");
    }
    let pathImage = null;
    if (image && image.length > 0) {
      pathImage = `static/image-party-list/${`image-list-party${moment().format(
        "DDMMYYYYHHmmss"
      )}.png`}`;
      const base64Data = image[0].replace(/^data:image\/png;base64,/, "");

      await fs.writeFile(pathImage, base64Data, "base64", function (err) {
        pathImage = null;
      });
    }
    await await PartyList.update(
      {
        user_id: findUser.id,
        party_name: partyName,
        people_number: peopleNumber,
        description: description,
        image: pathImage,
      },
      {
        where: {
          id: partyId,
        },
      }
    );
    res.json({ ...Config.RESPONSE_SUCCESS });
  } catch (e) {
    res.json({ ...Config.RESPONSE_ERROR, message: e.message });
  }
});

router.delete(path + "/", async (req, res) => {
  try {
    const { id, token } = req.query;
    const decoded = JWT.verify(token, Config.secret_key);
    if (!decoded) {
      throw Error("token expired");
    }
    await await PartyList.destroy({ where: { id: id } });
    await await PartyJoin.destroy({ where: { party_id: id } });

    res.json({ ...Config.RESPONSE_SUCCESS });
  } catch (e) {
    res.json({ ...Config.RESPONSE_ERROR, message: e.message });
  }
});

module.exports = router;
