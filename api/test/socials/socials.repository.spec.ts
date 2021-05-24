import { Test } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SocialsRepository } from '../../src/socials/socials.repository';

const mockSocials = [
  {
    id: 1,
    category: 1,
    url: 'https://',
    userId: 1,
  },
  {
    id: 2,
    category: 2,
    url: 'https://',
    userId: 1,
  },
];

const mockCreateSocialsDto = {
  category: 1,
  url: 'https://',
  user: {
    id: 1,
    name: 'testName',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUpdateSocialsDto = {
  category: 2,
  url: 'https://',
};

describe('SocialsRepository', () => {
  let socialsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SocialsRepository],
    }).compile();

    socialsRepository = await module.get<SocialsRepository>(SocialsRepository);
  });

  describe('getAllSocials', () => {
    it('getAllSocialsに成功', async () => {
      socialsRepository.find = jest.fn().mockResolvedValue(mockSocials);
      expect(socialsRepository.find).not.toHaveBeenCalled();

      const result = await socialsRepository.getAllSocials();
      expect(socialsRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockSocials);
    });
  });

  describe('getSocialsById', () => {
    it('getSocialsByIdに成功すると、該当のsocialを返す', async () => {
      socialsRepository.findOne = jest.fn().mockResolvedValue(mockSocials[0]);
      expect(socialsRepository.findOne).not.toHaveBeenCalled();

      const result = await socialsRepository.getSocialsById(1);
      expect(socialsRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockSocials[0]);
    });
  });

  describe('getSocialsByUserId', () => {
    it('getSocialsByUserIdに成功すると、該当のsocialsを返す', async () => {
      const getMany = jest.fn().mockResolvedValue(mockSocials);
      const where = jest.fn(() => ({ getMany }));
      socialsRepository.createQueryBuilder = jest.fn(() => ({ where }));

      const result = await socialsRepository.getSocialsByUserId(1);
      expect(socialsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockSocials);
    });
  });

  describe('createSocial', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      socialsRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('createSocialに成功', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        socialsRepository.createSocial(mockCreateSocialsDto),
      ).resolves.not.toThrow();
    });

    it('createSocialに失敗した場合、errorを返す', async () => {
      save.mockRejectedValue({ code: '111' });
      await expect(
        socialsRepository.createSocial(mockCreateSocialsDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateSocial', () => {
    it('updateSocialに成功', async () => {
      const save = jest.fn().mockResolvedValue(true);

      socialsRepository.getSocialsById = jest.fn().mockResolvedValue({
        id: 1,
        mockUpdateSocialsDto,
        save,
      });
      expect(socialsRepository.getSocialsById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await socialsRepository.updateSocial(
        1,
        mockUpdateSocialsDto,
      );
      expect(socialsRepository.getSocialsById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.mockUpdateSocialsDto).toEqual(mockUpdateSocialsDto);
    });
  });

  describe('deleteSocial', () => {
    beforeEach(() => {
      socialsRepository.delete = jest.fn();
    });

    it('socialを削除する', async () => {
      socialsRepository.delete.mockResolvedValue({ affected: 1 });
      expect(socialsRepository.delete).not.toHaveBeenCalled();

      await socialsRepository.deleteSocial(1);
      expect(socialsRepository.delete).toHaveBeenCalled();
    });

    it('socialが無い場合は、errorを返す', async () => {
      socialsRepository.delete.mockResolvedValue({ affected: 0 });

      expect(socialsRepository.deleteSocial(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteSocialsByUserId', () => {
    it('userIdが一致するsocialを削除する', async () => {
      socialsRepository.getSocialsByUserId = jest
        .fn()
        .mockResolvedValue(mockSocials);
      socialsRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
      expect(socialsRepository.getSocialsByUserId).not.toHaveBeenCalled();
      expect(socialsRepository.delete).not.toHaveBeenCalled();

      await socialsRepository.deleteSocialsByUserId(1);
      expect(socialsRepository.getSocialsByUserId).toHaveBeenCalled();
      expect(socialsRepository.delete).toHaveBeenCalled();
    });
  });
});
