import {v4 as uuid} from 'uuid';

//ponerle nombre al archivo
export const fileNamer=( req: Express.Request, file: Express.Multer.File, callback: Function)=> {

    if(!file) return (new Error('File is empty'), false);

    const fileExtension= file.mimetype.split('/')[1];

    const fileName =  `${uuid()}.${fileExtension}`;

    callback(null, fileName);
}