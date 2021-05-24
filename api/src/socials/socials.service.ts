import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialsRepository } from './socials.repository';
import { Social } from './socials.entity';
import { CreateSocialsDto } from './dto/create-socials.dto';
import { UpdateSocialsDto } from './dto/update-socials.dto';
import { MyKnownMessage } from '../message.interface';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(SocialsRepository)
    private socialsRepository: SocialsRepository,
  ) {}

  async getAllSocials(): Promise<Social[]> {
    return await this.socialsRepository.getAllSocials();
  }

  async getSocialsById(id: number): Promise<Social> {
    return await this.socialsRepository.getSocialsById(id);
  }

  async getSocialsByUserId(userId: number): Promise<Social[]> {
    return await this.socialsRepository.getSocialsByUserId(userId);
  }

  async createSocial(createSocialsDto: CreateSocialsDto): Promise<Social> {
    return await this.socialsRepository.createSocial(createSocialsDto);
  }

  async updateSocial(
    id: number,
    updateSocialsDto: UpdateSocialsDto,
  ): Promise<Social> {
    return await this.socialsRepository.updateSocial(id, updateSocialsDto);
  }

  async deleteSocial(id: number): Promise<MyKnownMessage> {
    return await this.socialsRepository.deleteSocial(id);
  }

  async deleteSocialsByUserId(userId: number): Promise<MyKnownMessage> {
    return await this.socialsRepository.deleteSocialsByUserId(userId);
  }
}
