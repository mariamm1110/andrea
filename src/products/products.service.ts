import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { title } from 'process';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource //queryrunner

  ){}

  async create(createProductDto: CreateProductDto, user: User) {
    try{
      //insertar imagenes
      const {images=[], ...productdetails}=createProductDto;

      const product = this.productRepository.create({
        ...productdetails,
        images: images.map( image=> this.productImageRepository.create({url: image})),
        user: user

      });

      await this.productRepository.save(product);

      return {...product, images};
    }catch(error){

      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, tag?: string) {
    

    const {limit=10, offset=0}= paginationDto;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .take(limit)
      .skip(offset);

      if (tag) {
        console.log('Filtering by tag (Safe):', tag);
        queryBuilder.andWhere(':tag = ANY(product.tags)', { tag });
      }

    const products= await queryBuilder.getMany();

    return products.map((product)=>({
      ...product,
      images: product.images.map(img=>img.url)
    }));
  }

  async findAllSafe(paginationDto: PaginationDto, user: Partial<User>, tag?:string){

    const {limit=10, offset=0}= paginationDto;

    //query products donde legal esta en true
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      // .where('product.isLegal = :isLegal', {isLegal: true})
      .take(limit)
      .skip(offset);

      if(!user?.roles?.includes('hidden-user')) {

        queryBuilder.where('product.isLegal = :isLegal', { isLegal: true });
      }

      if (tag) {
        console.log('Filtering by tag:', tag);
        // Usamos una consulta más compatible para filtrar por tags
        queryBuilder.andWhere(':tag = ANY(product.tags)', { tag });
      }


    const products = await queryBuilder.getMany();

    return products.map((product) => ({
      ...product,
      images: product.images.map(img => img.url)
    }));
  }

  

  async findOne(term: string) {
    
    let product: Product;

    if( isUUID(term)){
      product = await this.productRepository.findOneBy({id: term});
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(prod.title) = :title', { title: term.toUpperCase() })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

    }

    if(!product)
      throw new NotFoundException( `Product with ${ term } not found` );

    return product;
  }

  async findOneSafe(term: string): Promise<Product> {
    let product: Product;

    console.log('Received term:', term);

    if (isUUID(term)) {
        console.log('Searching by UUID');
        product = await this.productRepository.findOne({
            where: { id: term, isLegal: true },
            relations: { images: true }
        });
    } else {
        console.log('Searching by title or slug');
        try {
            product = await this.productRepository
                .createQueryBuilder('prod')
                .where('UPPER(prod.title) LIKE :title OR prod.slug = :slug', {
                    title: `%${term.toUpperCase()}%`,
                    slug: term,
                })
                .andWhere('prod.isLegal = :isLegal', { isLegal: true })
                .leftJoinAndSelect('prod.images', 'prodImages')
                .getOne();
        } catch (error) {
            console.error('Error during query execution:', error);
            throw new Error('Query execution failed');
        }
    }

    if (!product) {
        console.error(`Product not found with term: ${term}`);
        throw new NotFoundException(`Legal product with term "${term}" not found`);
    }

    console.log('Product found:', product);
    return product;
  }

  async searchProducts(term: string) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.title) LIKE :term', { term: `%${term.toLowerCase()}%` })
      .andWhere('product.isLegal = true')
      .limit(5)
      .getMany();
  }

  



  async findOnePlain(term: string){
    const {images=[], ...rest}=await this.findOne(term);
    return{
      ...rest,
      images: images.map(image=>image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const {images, ...toUpdate}=updateProductDto;

    const product = await this.productRepository.preload({id, ...toUpdate});

    if(!product) throw new NotFoundException (`Product #${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      if(images){
        await queryRunner.manager.delete(ProductImage, {product: {id}});

        product.images = images.map(image=> this.productImageRepository.create({url: image}));
      } else {
        product.images = await this.productImageRepository.findBy({product: {id}});
      }

      product.user= user;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

      
    }catch (error) {

      await queryRunner.rollbackTransaction();

      this.handleDBExceptions(error);

    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any){

    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');

    try{
      return await query
        .delete()
        .where({})
        .execute();
    }catch(error){
      this.handleDBExceptions(error);
    }
  }
}
