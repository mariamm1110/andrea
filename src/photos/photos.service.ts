import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { handleDBExceptions } from 'src/common/exceptions/db-exception-handler';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Photo } from './entities/photo.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';



@Injectable()
export class PhotosService {

  private readonly logger =  new Logger('PhotosService');

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,

  ){}

  async create(createPhotoDto: CreatePhotoDto) {
    try{

      
      const photo = this.photoRepository.create({
        ...createPhotoDto
        
      });

      await this.photoRepository.save(photo);
      return photo;
    }catch(error){

      handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit=10, offset=0}= paginationDto;

    const photos= await this.photoRepository.find({
      take: limit,
      skip: offset,
      
    });

    return photos;

  }

  async findOne(term: string) {
    let photo : Photo;
    
    photo = await this.photoRepository.findOneBy({id: term});

    if(!photo)
      throw new NotFoundException(`Photo with id ${term} not found`);

    return photo;
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    
    const photo = await this.photoRepository.preload({id, ...updatePhotoDto});

    if(!photo) throw new NotFoundException(`Photo with id ${id} not found`);

    try{

      await this.photoRepository.save(photo);

      return photo;

    }catch(error){
      handleDBExceptions(error);
    }

    
  }

  async remove(id: string) {
    const photo = await this.findOne(id);

    await this.photoRepository.remove(photo);
  }

  async deleteAllPhotos(){
    const query = this.photoRepository.createQueryBuilder('photo');

    try{

      return await query
      .delete()
      .where({})
      .execute();

    }catch(error){
      handleDBExceptions(error);
    }
  }

}


