import {MulterModuleOptions, MulterOptionsFactory} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as shell from 'shelljs';
import * as crypto from 'crypto';
import * as mime from 'mime';
import {Injectable} from '@nestjs/common';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            fileFilter: (req, file, callback) => {
                if (!file.originalname.toLocaleLowerCase().match(/\.(jpg|png|mp3|mp4|pdf)$/)) {
                    return callback(new Error('File has an extension that is not allowed!'), false);
                }
                callback(null, true);
            },
            storage: diskStorage({
                destination: (req, file, cb) => {
                    if (!fs.existsSync(`${process.env.UPLOAD_CHAT_PATH}`)) {
                        shell.mkdir('-p', `${process.env.UPLOAD_CHAT_PATH}`);
                    }
                    cb(null, `${process.env.UPLOAD_CHAT_PATH}`);
                },
                filename: (req, file, cb) => {
                    crypto.pseudoRandomBytes(16, (err, raw) => {
                        if (err) {
                            return cb(err, file.originalname);
                        }
                        cb(null, `${raw.toString('hex')}.${mime.getExtension(file.mimetype.toLowerCase())}`);
                    });
                },
            }),
        };
    }

}
