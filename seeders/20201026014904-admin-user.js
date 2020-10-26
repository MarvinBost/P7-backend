'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     *
     */
    return queryInterface.bulkInsert('Users', [{
      username: 'Admin',
      email: 'admin@groupomania.fr',
      password: '$2b$05$qwDjkCyfuiXIn2B/TJt0/eIoDR/egGup6EeaWqLinjvnPr8czIDtW',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};