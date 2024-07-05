// const fs = require('fs');
// const csv = require('csv-parser');
// const { AppDataSource } = require('../DataSourcs/datasource');
// const Airport = require('../Entities/airport');
// const City = require('../Entities/city');
// const Country = require('../Entities/country');

// AppDataSource.initialize().then(async () => {
//     const countryRepository = AppDataSource.getRepository('Country');
//     const cityRepository = AppDataSource.getRepository('City');
//     const airportRepository = AppDataSource.getRepository('Airport');

//     // Import Country Data
//     fs.createReadStream('../Data/Database-country.csv')
//         .pipe(csv())
//         .on('data', async (row) => {
//             const country =  countryRepository.create(row);
//             await countryRepository.save(country);
//         })
//         .on('end', () => {
//             console.log('Country data imported successfully');
//         });

//     // Import City Data ImportData/Database - airport.csv
//     fs.createReadStream('../Data/Database-city.csv')
//         .pipe(csv())
//         .on('data', async (row) => {
//             const city = cityRepository.create(row);
//             await cityRepository.save(city);
//         })
//         .on('end', () => {
//             console.log('City data imported successfully');

//         });

//     // Import Airport Data
//     fs.createReadStream('../Data/Database-airport.csv')
//         .pipe(csv())
//         .on('data', async (row) => {
//             const airport = airportRepository.create(row);
//             await airportRepository.save(airport);
//         })
//         .on('end', () => {
//             console.log('Airport data imported successfully');
//         });
// }).catch(error => console.log(error));

const fs = require('fs');
const csv = require('csv-parser');
const { AppDataSource } = require('../DataSourcs/datasource');
const Airport = require('../Entities/airport');
const City = require('../Entities/city');
const Country = require('../Entities/country');

AppDataSource.initialize().then(async () => {
    const countryRepository = AppDataSource.getRepository(Country);
    const cityRepository = AppDataSource.getRepository(City);
    const airportRepository = AppDataSource.getRepository(Airport);

    // Helper function to batch insert records
    const batchInsert = async (repository, records) => {
        try {
            await repository.save(records);
            console.log(`${records.length} records inserted successfully`);
        } catch (error) {
            console.error('Error inserting records:', error);
        }
    };

    // Import Country Data
    let countryBatch = [];
    fs.createReadStream('../Data/Database-country.csv')
        .pipe(csv())
        .on('data', (row) => {
            const country = countryRepository.create(row);
            countryBatch.push(country);
            if (countryBatch.length >= 100) { // Adjust batch size as needed
                batchInsert(countryRepository, countryBatch);
                countryBatch = [];
            }
        })
        .on('end', async () => {
            if (countryBatch.length > 0) {
                await batchInsert(countryRepository, countryBatch);
            }
            console.log('Country data import finished');
        })
        .on('error', (error) => {
            console.error('Error reading country CSV:', error);
        });

    // Import City Data
    let cityBatch = [];
    fs.createReadStream('../Data/Database-city.csv')
        .pipe(csv())
        .on('data', async (row) => {
            // Check if city with the same ID already exists
            const existingCity = await cityRepository.findOneBy({ id: row.id });
            if (existingCity) {
                console.log(`City with ID ${row.id} already exists. Skipping record.`);
                return; // Skip inserting this record
            }

            const city = cityRepository.create(row);
            cityBatch.push(city);
            if (cityBatch.length >= 100) { // Adjust batch size as needed
                await batchInsert(cityRepository, cityBatch);
                cityBatch = [];
            }
        })
        .on('end', async () => {
            if (cityBatch.length > 0) {
                await batchInsert(cityRepository, cityBatch);
            }
            console.log('City data import finished');
        })
        .on('error', (error) => {
            console.error('Error reading city CSV:', error);
        });

    // Import Airport Data
    let airportBatch = [];
    fs.createReadStream('../Data/Database-airport.csv')
        .pipe(csv())
        .on('data', async (row) => {
            // Check if city_id exists in the city table
            const cityExists = await cityRepository.findOneBy({ id: row.city_id });
            if (!cityExists) {
                console.error(`City ID ${row.city_id} does not exist. Skipping airport record.`);
                return;
            }

            // Check if airport with the same ID already exists
            const existingAirport = await airportRepository.findOneBy({ id: row.id });
            if (existingAirport) {
                console.log(`Airport with ID ${row.id} already exists. Skipping record.`);
                return; // Skip inserting this record
            }

            const airport = airportRepository.create(row);
            airportBatch.push(airport);
            if (airportBatch.length >= 100) { // Adjust batch size as needed
                await batchInsert(airportRepository, airportBatch);
                airportBatch = [];
            }
        })
        .on('end', async () => {
            if (airportBatch.length > 0) {
                await batchInsert(airportRepository, airportBatch);
            }
            console.log('Airport data import finished');
        })
        .on('error', (error) => {
            console.error('Error reading airport CSV:', error);
        });

}).catch(error => console.log('Error initializing data source:', error));
