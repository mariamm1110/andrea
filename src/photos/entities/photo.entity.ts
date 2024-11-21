import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Type } from 'class-transformer';
import { Model } from "src/models/entities/model.entity";
import { Event } from "src/events/entities/event.entity";



@Entity({name: 'photos'})
export class Photo {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('text')
    url: string;

    @Column({
        type: 'float',
        default: 100
    })    
    price: number;

    @Column({
        type: 'enum',
        enum: ['digital', 'print'],
        default: 'digital'
    })
    type: 'digital' | 'print';


    @ManyToMany(() => Model, model => model.photos)
    @JoinTable()
    models: Model[];

    @ManyToOne(() => Event, (event) => event.photos, { nullable: true, onDelete: 'CASCADE' })
    event: Event;

}
