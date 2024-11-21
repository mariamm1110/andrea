import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { handleDBExceptions } from 'src/common/exceptions/db-exception-handler';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Model } from './entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Photo } from 'src/photos/entities/photo.entity';
import { title } from 'process';


@Injectable()
export class ModelsService {

  private readonly logger =  new Logger('ModelsService');

  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>

  ){}

  async create(createModelDto: CreateModelDto) {
    try{

      
      const model = this.modelRepository.create({
        ...createModelDto
        
      });

      await this.modelRepository.save(model);
      return model;
    }catch(error){

      handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit=10, offset=0}= paginationDto;

    const models= await this.modelRepository.find({
      take: limit,
      skip: offset,
      relations: ['photos']
      
    });

    return models;

  }

  async findOne(term: string) {
    let model: Model;
    
    model = await this.modelRepository.findOne({
      where: { id: term },
      relations: ['photos']
    })

    if(!model)
      throw new NotFoundException(`Model with id ${term} not found`);

    return model;
  }

  async update(id: string, updateModelDto: UpdateModelDto) {
    
    const model = await this.modelRepository.preload({id, ...updateModelDto});

    if(!model) throw new NotFoundException(`Model with id ${id} not found`);

    try{

      await this.modelRepository.save(model);

      return model;

    }catch(error){
      handleDBExceptions(error);
    }

    
  }

  async remove(id: string) {
    const model = await this.findOne(id);

    await this.modelRepository.remove(model);
  }

  async deleteAllModels(){
    const query = this.modelRepository.createQueryBuilder('model');

    try{

      return await query
      .delete()
      .where({})
      .execute();

    }catch(error){
      handleDBExceptions(error);
    }
  }

  async addPhotoToModel(modelId: string, photoUrl: string, title: string) {
    const model = await this.modelRepository.findOne({ where: {id: modelId}, relations: ['photos']});
    if (!model) {
      throw new NotFoundException(`Model with id ${modelId} not found`);
    }

    console.log('Adding photo with URL:', photoUrl, 'and title:', title);


    if (!photoUrl || !title) {
      throw new BadRequestException('Photo URL or title is missing');
    }

    const photo = this.photoRepository.create({
       url: photoUrl, 
       title: title,
       models: [model]
    });
    console.log('Photo data before save:', photo);

    await this.photoRepository.save(photo);
    return photo;
  }

}

