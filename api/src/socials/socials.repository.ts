import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Social } from './socials.entity';
import { CreateSocialsDto } from './dto/create-socials.dto';
import { UpdateSocialsDto } from './dto/update-socials.dto';
import { MyKnownMessage } from '../message.interface';

@EntityRepository(Social)
export class SocialsRepository extends Repository<Social> {
  async getAllSocials(): Promise<Social[]> {
    return await this.find({});
  }

  async getSocialsById(id: number): Promise<Social> {
    const found = await this.findOne(id);

    return found;
  }

  async getSocialsByUserId(userId: number): Promise<Social[]> {
    const found = await this.createQueryBuilder('socials')
      .where('socials.userId = :userId', { userId })
      .getMany();

    return found;
  }

  async createSocial(createSocialsDto: CreateSocialsDto): Promise<Social> {
    const { category, url, user } = createSocialsDto;

    const social = this.create();
    social.category = category;
    social.url = url;
    social.userId = user.id;

    try {
      await social.save();

      return social;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateSocial(
    id: number,
    updateSocialsDto: UpdateSocialsDto,
  ): Promise<Social> {
    const found = await this.getSocialsById(id);
    const { category, url } = updateSocialsDto;

    found.category = category;
    found.url = url;

    await found.save();
    return found;
  }

  async deleteSocial(id: number): Promise<MyKnownMessage> {
    const result = await this.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`ID: ${id}のsocialは存在しません`);
    }

    return { message: 'SNSを削除しました' };
  }

  async deleteSocialsByUserId(userId: number): Promise<MyKnownMessage> {
    const targetSocials = await this.getSocialsByUserId(userId);

    if (targetSocials.length > 0) {
      targetSocials.map(
        async (targetSocial) => await this.delete({ id: targetSocial.id }),
      );
      return { message: 'SNSを削除しました' };
    }
  }
}
