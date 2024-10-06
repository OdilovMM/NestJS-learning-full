/* eslint-disable prettier/prettier */
var dbConfig = {
    synchronize: false,
    migrations: ['migrations/*.js'],
    cli: {
        migrationsDir: 'migrations',
    }
}

switch(process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js']
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts']
        });
        break;
    case 'production':
        Object.assign(dbConfig, {
            // install postgres 'npm install pg'  postgres driver
            type: 'postgres',
            url: process.env.DATABASE_URL,
            migrationsRun: true,
            entities: ['**/*.entity.js'],
            ssl: {
                rejectUnauthorized: false
            }
        });
        break;
    default:
        throw new Error('Unknown environment')
}

module.exports = dbConfig;




// 1. Add this script to the package.json below
// **** "typeorm": "mode --require ts-node/register ./node_modules/typeorm/cli.js"  ::::  add this script to the package.json after this file

// 2. add Migration run
// npm run typeorm migration:generate -- -n initial-schema -o ::: in the terminal