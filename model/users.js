module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    new_feed: {
      type: Sequelize.BOOLEAN,
    },
  });

  return users;
};
