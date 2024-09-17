import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    tags: string[];

    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];

    
}
