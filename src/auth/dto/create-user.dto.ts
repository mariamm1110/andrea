import { IsArray, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    email:string;

    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(3)
    fullName: string;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    roles?: string[];
   
}
