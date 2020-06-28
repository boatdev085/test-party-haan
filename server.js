const next = require("next");
const glob = require("glob");
const path = require("path");
const db = require("./model/index");
const dotenv = require("dotenv");
dotenv.config();
const dev = process.env.NODE_ENV !== "production";
global.app = next({ dev });
global.express = require("express");
global.appRoot = path.resolve(__dirname);
const handle = app.getRequestHandler();
const port = process.env.PORT || 8080;
// db.sequelize.sync({ force: true });
db.sequelize.sync();
app
  .prepare()
  .then(() => {
    const server = express();
    server.use(express.json({ limit: "50mb" }));
    server.use(express.urlencoded({ extended: false, limit: "50mb" }));
    server.use(express.static("static"));
    glob.sync("./api/**/*.js").forEach((file) => {
      server.use((req, res, next) => {
        require(file)(req, res, next);
      });
    });
    server.get("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:8080");
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
