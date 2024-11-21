import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ModelsService } from 'src/models/models.service';
import { ProductsService } from 'src/products/products.service';
import { EventsService } from 'src/events/events.service';
import { PhotosService } from 'src/photos/photos.service';
import { MembershipService } from 'src/membership/membership.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { CreateModelDto } from 'src/models/dto/create-model.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateModelDto } from 'src/models/dto/update-model.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { CreateEventDto } from 'src/events/dto/create-event.dto';
import { UpdateEventDto } from 'src/events/dto/update-event.dto';
import { CreatePhotoDto } from 'src/photos/dto/create-photo.dto';
import { UpdatePhotoDto } from 'src/photos/dto/update-photo.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), UserRoleGuard)
@Auth(ValidRoles.admin)
export class AdminController {
  constructor(
    private readonly modelsService: ModelsService,
    private readonly productsService: ProductsService,
    private readonly eventsService: EventsService,
    private readonly photosService: PhotosService,
    private readonly membershipService: MembershipService
  ) {}

  //MODELOS
  @Post('models')
  @Auth(ValidRoles.admin)
  createModel(@Body() createModelDto: CreateModelDto) {
    return this.modelsService.create(createModelDto);
  }

  

  @Patch('models/:id')
  @Auth(ValidRoles.admin)
  updateModel(@Param('id') id: string, 
  @Body() updateModelDto: UpdateModelDto) {
    return this.modelsService.update(id, updateModelDto);
  }

  @Delete('models/:id')
  removeModel(@Param('id') id: string) {
    return this.modelsService.remove(id);
  }

  @Post('models/:id/photos')
  addPhotoModel(
    @Param('id') modelId: string,
    @Body('photoUrl') photoUrl: string,
    @Body('title') title: string
  ) {
    return this.modelsService.addPhotoToModel(modelId, photoUrl, title);
  }

  //PRODUCTOS

  @Post('products')
  @Auth(ValidRoles.admin)
  @ApiResponse({status:201, description: 'Product created', type: Product})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden'})  
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
  ) {
    return this.productsService.create(createProductDto, user);
  }


  @Get('products')
  @Auth(ValidRoles.hiddenUser, ValidRoles.admin)
  findAllProducts(
    @Query() paginationDto: PaginationDto,
    
  ) {
    const {limit, offset, tag}= paginationDto;
    console.log('received tag:', tag);
    return this.productsService.findAll({limit, offset}, tag);
  }

  @Patch('products/:id')
  @Auth(ValidRoles.admin)
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete('products/:id')
  @Auth(ValidRoles.admin)
  removeProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  //EVENTOS

  @Get('events')
  findAllEvent(@Query() paginationDto: PaginationDto) {
    return this.photosService.findAll(paginationDto);
  }

  @Get('events/:term')
  findOneEvent(@Param('term') term: string) {
    return this.photosService.findOne(term);
  }

  @Post('events')
  @Auth(ValidRoles.admin)
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Patch('events/:id')
  @Auth(ValidRoles.admin)
  updateEvent(@Param('id') id: string, 
  @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete('events/:id')
  removeEvent(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  //PHOTOS

  @Get('photos')
  findAllPhoto(@Query() paginationDto: PaginationDto) {
    return this.photosService.findAll(paginationDto);
  }

  @Get('photos/:term')
  findOnePhoto(@Param('term') term: string) {
    return this.photosService.findOne(term);
  }
  @Post('photos')
  @Auth(ValidRoles.admin)
  createPhoto(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(createPhotoDto);
  }

  @Patch('photos/:id')
  @Auth(ValidRoles.admin)
  updatePhoto(@Param('id') id: string, 
  @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto);
  }

  @Delete('photos/:id')
  removePhoto(@Param('id') id: string) {
    return this.photosService.remove(id);
  }

  //MEMBERSHIP
  @Post(':userId/subscribe')
  subscribeUser(
    @Param('userId') userId:string,
    @Body('password') password: string
  ) {
    return this.membershipService.subscribe(userId, password);
  }

  @Post(':userId/unsubscribe')
  unsubscribeUser(@Param('userId') userId:string) {
    return this.membershipService.unsubscribe(userId);
  }
}
