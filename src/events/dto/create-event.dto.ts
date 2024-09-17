import { IsDate, IsOptional, IsString, MinLength } from "class-validator";

export class CreateEventDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(2)
    location: string;

    @IsDate()
    eventDate: Date;

    //! No c que hacer con modelos y fotos 



}
