import { IsDecimal, IsEnum, IsNumber, IsString, IsUrl, isURL, MinLength } from "class-validator";

export class CreatePhotoDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsUrl()
    url: string;

    @IsNumber()
    price: number;

    @IsEnum(['digital', 'print'])
    type: 'digital' | 'print';

    

}
