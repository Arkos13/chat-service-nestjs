import {MailerOptions} from "@nestjs-modules/mailer/dist/interfaces/mailer-options.interface";
import * as dotenv from 'dotenv';
dotenv.config();

const config: MailerOptions = {
    transport: process.env.MAILER_DSN,
    defaults: {
        from: process.env.MAILER_FROM
    }
};

export = config;