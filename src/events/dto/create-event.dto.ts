import { IsArray, IsDate, IsISO8601, IsOptional, IsString, MinLength } from "class-validator";

export class CreateEventDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(2)
    location: string;

    @IsISO8601()
    eventDate: Date;

    @IsArray()
    @IsOptional()
    modelIds: string[];

    @IsArray()
    @IsOptional()
    photoIds: string[];

    //! No c que hacer con modelos y fotos 



}
