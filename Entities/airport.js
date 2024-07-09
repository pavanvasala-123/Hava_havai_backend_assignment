const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Airport',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        icao_code: {
            type: 'varchar'
        },
        iata_code: {
            type: 'varchar'
        },
        name: {
            type: 'varchar'
        },
        type: {
            type: 'varchar'
        },
        city_id: {
            type: 'int'
        },
        country_id: {
            type: 'int'
        },
        continent_id:{
            type: 'int'
        },
        website_url:{
            type:'varchar'
        },
        latitude_deg: {
            type: 'double'
        },
        longitude_deg: {
            type: 'double'
        },
        elevation_ft: {
            type: 'double'
        },
        wikipedia_link:{
            type:'varchar'
        }
    },
    relations: {
        city: {
            type: 'many-to-one',
            target: 'City',
            joinColumn: { name: 'city_id' },
            inverseSide: 'airports'
        }
    }
});
