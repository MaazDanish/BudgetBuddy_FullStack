import { Sequelize, Dialect } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME || '',
    process.env.DB_USERNAME || '',
    process.env.DB_PASSWORD || '',
    {
        dialect: process.env.DB_DIALECT as Dialect || 'mysql',
        host: process.env.DB_HOST || 'localhost '
    }
);

export default sequelize