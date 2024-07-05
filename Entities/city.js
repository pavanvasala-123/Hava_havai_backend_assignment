const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'City',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar'
        },
        alt_name: {
            type: 'varchar'
        },
        country_id: {
            type: 'int'
        },
        is_active: {
            type: 'varchar'
        },
        lat: {
            type: 'double'
        },
        long: {
            type: 'double'
        }
    },
    relations: {
        country: {
            type: 'many-to-one',
            target: 'Country',
            joinColumn: { name: 'country_id' },
            inverseSide: 'cities'
        },
        airports: {
            type: 'one-to-many',
            target: 'Airport',
            inverseSide: 'city'
        }
    }
});
