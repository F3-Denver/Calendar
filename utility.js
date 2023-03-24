import path from 'path';
import {fileURLToPath} from 'url';

export function getFullFilePath(relativeFilePath){
    const thisFilePath = fileURLToPath(import.meta.url);
    const thisFileDir = path.dirname(thisFilePath);
    const filePath = path.join(thisFileDir, relativeFilePath);

    return filePath;
}