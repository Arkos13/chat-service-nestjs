import {FileSystemInterface} from "./file-system.interface";
import * as fs from 'fs';
import {join} from "path";

export class FileSystem implements FileSystemInterface {
    remove(path: string): void {
        const fullPath = join(__dirname, '..', '..', '..', '..', '..', path);
        if(fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }

}