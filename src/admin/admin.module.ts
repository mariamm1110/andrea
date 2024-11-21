import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ModelsModule } from 'src/models/models.module';
import { ProductsModule } from 'src/products/products.module';
import { EventsModule } from 'src/events/events.module';
import { PhotosModule } from 'src/photos/photos.module';
import { MembershipModule } from 'src/membership/membership.module';

@Module({
  imports: [
    ModelsModule,
    ProductsModule,
    EventsModule, 
    PhotosModule,
    MembershipModule
  ],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
