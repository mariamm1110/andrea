import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string){
        console.log(imageName);

        const path= join(__dirname, '../../static/products', imageName);

        return path;

    }
}
