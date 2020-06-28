module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define("party_list", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    party_name: {
      type: Sequelize.STRING,
    },
    people_number: {
      type: Sequelize.INTEGER,
    },
    image: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  });

  return users;
};
