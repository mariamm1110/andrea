import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";


@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: 'ccbfa2ff-1c6f-4b50-947f-0fb199e52677',
        description: 'Product Id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique:true
    })
    title:string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('int',{
        default: 0
    })
    stock:number;

    @Column('text', {
        array: true,
        default: []  
    })
    tags: string[];

    @Column('text', {
        nullable: false,
        array: true,
        default: ['public']
    })
    roles: string[];

    @Column('bool', {
        default: false
    })
    isLegal: boolean;

    //images
    @OneToMany(
        ()=> ProductImage,
        (ProductImage)=> ProductImage.product,
        {cascade: true, eager:true}
    )
    images?: ProductImage[];

    @ManyToOne(
        ()=> User,
        (user) => user.product,
        {eager: true}
    )
    user: User;
}
