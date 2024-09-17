import { IsArray, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateModelDto {
    
    @IsString()
    @MinLength(1)
    artisticName: string;

    @IsString()
    @MinLength(4)
    @IsEmail()
    contactEmail: string;

    @IsString()
    @IsOptional()
    information?: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    achievments: string[];

}
