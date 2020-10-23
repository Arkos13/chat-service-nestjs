import * as dotenv from 'dotenv';
import {TypeOrmModuleOptions} from "@nestjs/typeorm";
dotenv.config();

const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}',],
    synchronize: false,
    logging: ['error', 'warn'],
    migrations: [__dirname + '/../infrastructure/migrations/*{.ts,.js}',],
    cli: {migrationsDir: "src/infrastructure/migrations"}
};

export = config;
