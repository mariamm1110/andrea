import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';


@ApiTags('products')
@Controller('products')


export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({status:201, description: 'Product created', type: Product})
  @ApiResponse({status:400, description: 'Bad request'})
  @ApiResponse({status:403, description: 'Forbidden'})  
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @Auth(ValidRoles.hiddenUser)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get()
  findAllSafe(@Query() paginationDto: PaginationDto){
    return this.productsService.findAllSafe(paginationDto);
  }

  @Get(':term')
  @Auth(ValidRoles.hiddenUser)
  findOne(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }

  @Get(':term')
  findOneSafe(@Param('term') term: string) {
    return this.productsService.findOne(term);
  }


  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
