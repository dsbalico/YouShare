'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const config = require('config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltWorkFactor = config.get('saltWorkFactor');
    const salt = await bcrypt.genSalt(saltWorkFactor);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Smith',
        role: 'admin',
        job: 'Software Engineer',
        username: 'johnsmith',
        email: 'johnsmith@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: 'Jane',
        middleName: 'Alice',
        lastName: 'Doe',
        job: 'Web Developer',
        role: 'admin',
        username: 'janedoe',
        email: 'janedoe@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: 'Mike',
        middleName: 'Robert',
        lastName: 'Johnson',
        job: 'Data Scientist',
        username: 'mikejohnson',
        role: 'user',
        email: 'mikejohnson@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: 'Emily',
        middleName: 'Grace',
        lastName: 'Brown',
        job: 'UI/UX Designer',
        role: 'user',
        username: 'emilybrown',
        email: 'emilybrown@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        firstName: 'David',
        middleName: 'Michael',
        lastName: 'Williams',
        job: 'Full Stack Developer',
        role: 'user',
        username: 'davidwilliams',
        email: 'davidwilliams@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
