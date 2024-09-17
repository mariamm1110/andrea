import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "src/events/entities/event.entity";
import { Photo } from "src/photos/entities/photo.entity";
@Entity({name: 'models'})
export class Model {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique:true
    })
    artisticName:string;

    @Column({
        type: 'text',
    })
    contactEmail: string;

    @Column({
        type: 'text',
        nullable: true
    })
    information: string;

    @Column('text', {
        array: true,
        default: []  
    })
    achievments: string[];

    @ManyToMany(() => Event, event => event.models)
    events: Event[];

    @ManyToMany(() => Photo, photo => photo.models)
    photos: Photo[];
}
