module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define("party_join", {
    party_id: {
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    username: {
      type: Sequelize.STRING,
    },
  });

  return users;
};
