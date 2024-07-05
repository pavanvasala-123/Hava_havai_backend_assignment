require('reflect-metadata');
const { AppDataSource } = require('./DataSourcs/datasource');
const express = require('express');
const Airport = require('./Entities/airport');
const City = require('./Entities/city');
const Country = require('./Entities/country');

const app = express();
const port = 3000;



AppDataSource.initialize().then(() => {
    app.get('/api/airport', async (req, res) => {
        const { iata_code } = req.query;
        
        if (!iata_code) {
            return res.status(400).send({ error: 'iata_code is required' });
        }

        const airportRepository = AppDataSource.getRepository('Airport');

        const airport = await airportRepository.findOne({
            where: { iata_code },
            relations: ['city', 'city.country'],
        });

        if (!airport) {
            return res.status(404).send({ error: 'Airport not found' });
        }

        res.send({
            airport: {
                id: airport.id,
                icao_code: airport.icao_code,
                iata_code: airport.iata_code,
                name: airport.name,
                type: airport.type,
                latitude_deg: airport.latitude_deg,
                longitude_deg: airport.longitude_deg,
                elevation_ft: airport.elevation_ft,
                address: {
                    city: {
                        id: airport.city.id,
                        name: airport.city.name,
                        country_id: airport.city.country_id,
                        is_active: airport.city.is_active,
                        lat: airport.city.lat,
                        long: airport.city.long,
                    },
                    country: airport.city.country ? {
                        id: airport.city.country.id,
                        name: airport.city.country.name.trim(),
                        country_code_two: airport.city.country.country_code_two.trim(),
                        country_code_three: airport.city.country.country_code_three.trim(),
                        mobile_code: airport.city.country.mobile_code,
                        continent_id: airport.city.country.continent_id,
                    } : null,
                }
            }
        });
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}).catch(error => console.log(error));
