import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { SocialsService } from './socials.service';
import { Social } from './socials.entity';
import { CreateSocialsDto } from './dto/create-socials.dto';
import { UpdateSocialsDto } from './dto/update-socials.dto';
import { MyKnownMessage } from '../message.interface';

@Controller('socials')
export class SocialsController {
  constructor(private socialsService: SocialsService) {}

  @Get()
  getAllSocials(): Promise<Social[]> {
    return this.socialsService.getAllSocials();
  }

  @Get('/:id')
  getSocialsById(@Param('id', ParseIntPipe) id: number): Promise<Social> {
    return this.socialsService.getSocialsById(id);
  }

  @Get('/:userId/user')
  getSocialsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Social[]> {
    return this.socialsService.getSocialsByUserId(userId);
  }

  @Post()
  createSocial(
    @Body(ValidationPipe) createSocialsDto: CreateSocialsDto,
  ): Promise<Social> {
    return this.socialsService.createSocial(createSocialsDto);
  }

  @Patch('/:id')
  updateSocial(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSocialsDto: UpdateSocialsDto,
  ): Promise<Social> {
    return this.socialsService.updateSocial(id, updateSocialsDto);
  }
  @Delete('/:id')
  deleteSocial(@Param('id', ParseIntPipe) id: number): Promise<MyKnownMessage> {
    return this.socialsService.deleteSocial(id);
  }

  @Delete('/:userId/user')
  deleteSocialsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<MyKnownMessage> {
    return this.socialsService.deleteSocialsByUserId(userId);
  }
}
