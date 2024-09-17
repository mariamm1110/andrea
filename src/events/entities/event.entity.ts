import { Model } from "src/models/entities/model.entity";
import { Photo } from "src/photos/entities/photo.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'events'})
export class Event {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique:true
    })
    name:string;

    @Column({
        type: 'text',
    })
    location: string;

    @Column('date')
    eventDate: Date;

    @ManyToMany(() => Model, model => model.events)
    @JoinTable()  // This decorator is needed on the owning side of the relationship
    models: Model[];

    @OneToMany(()=> Photo, photo => photo.event)
    photos: Photo[];




}
