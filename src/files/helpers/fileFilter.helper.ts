

//! INSTALAR @types/multer
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if(!file) return (new Error('File is empty'), false);

    const fileExtension=file.mimetype.split('/')[1];
    const validExtentions=['jpg', 'jpeg', 'png', 'gif', 'svg'];

    if(validExtentions.includes(fileExtension)) {
        return callback(null, true);
    }

    callback(null, false);
}