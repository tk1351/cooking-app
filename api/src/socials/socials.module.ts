import { Module } from '@nestjs/common';
import { SocialsController } from './socials.controller';
import { SocialsService } from './socials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialsRepository } from './socials.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SocialsRepository])],
  controllers: [SocialsController],
  providers: [SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
