require('reflect-metadata');
const { DataSource } = require('typeorm');
const Airport = require('../Entities/airport');
const City = require('../Entities/city');
const Country = require('../Entities/country');

const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'pavan123',
    database: 'airports',
    entities: [Airport, City, Country],
    synchronize: true,
});

module.exports = { AppDataSource };
