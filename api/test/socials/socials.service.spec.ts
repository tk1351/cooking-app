import { Test } from '@nestjs/testing';
import { SocialsService } from '../../src/socials/socials.service';
import { SocialsRepository } from '../../src/socials/socials.repository';

const mockSocials = [
  {
    id: 1,
    category: 1,
    url: 'https://1',
  },
  {
    id: 2,
    category: 2,
    url: 'https://2',
  },
];

const mockCreateSocialsDto = {
  id: 1,
  category: 1,
  url: 'https://1',
};

const mockUpdateSocialsDto = {
  id: 1,
  category: 1,
  url: 'https://update',
};

const mockSocialsRepository = () => ({
  getAllSocials: jest.fn(),
  getSocialsById: jest.fn(),
  getSocialsByUserId: jest.fn(),
  createSocial: jest.fn(),
  updateSocial: jest.fn(),
  deleteSocial: jest.fn(),
  deleteSocialsByUserId: jest.fn(),
});

describe('Socials Service', () => {
  let socialsService;
  let socialsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SocialsService,
        { provide: SocialsRepository, useFactory: mockSocialsRepository },
      ],
    }).compile();

    socialsService = await module.get<SocialsService>(SocialsService);
    socialsRepository = await module.get<SocialsRepository>(SocialsRepository);
  });

  describe('getAllSocials', () => {
    it('全てのsocialsをrepositoryから取得する', async () => {
      socialsRepository.getAllSocials.mockResolvedValue(mockSocials);

      const result = await socialsService.getAllSocials();
      expect(socialsRepository.getAllSocials).toHaveBeenCalled();
      expect(result).toEqual(mockSocials);
    });
  });

  describe('getSocialsById', () => {
    it('getSocialsByIdを呼び、成功するとsocialを返す', async () => {
      socialsRepository.getSocialsById.mockResolvedValue(mockSocials[0]);

      const result = await socialsService.getSocialsById(1);
      expect(socialsRepository.getSocialsById).toHaveBeenCalled();
      expect(result).toEqual(mockSocials[0]);
    });
  });

  describe('getSocialsByUserId', () => {
    it('userIdをパラメーターとして渡し、成功するとsocialsを返す', async () => {
      socialsRepository.getSocialsByUserId.mockResolvedValue(mockSocials[0]);

      const result = await socialsService.getSocialsByUserId(1);
      expect(socialsRepository.getSocialsByUserId).toHaveBeenCalled();
      expect(result).toEqual(mockSocials[0]);
    });
  });

  describe('createSocial', () => {
    it('createSocialを呼び、成功するとsocialを返す', async () => {
      socialsRepository.createSocial.mockResolvedValue('someSocial');
      expect(socialsRepository.createSocial).not.toHaveBeenCalled();

      const result = await socialsService.createSocial(mockCreateSocialsDto);
      expect(result).toEqual('someSocial');
    });
  });

  describe('updateSocial', () => {
    it('updateSocialを成功する', async () => {
      socialsRepository.updateSocial.mockResolvedValue('updateSocial');
      expect(socialsRepository.updateSocial).not.toHaveBeenCalled();

      const result = await socialsService.updateSocial(mockUpdateSocialsDto);
      expect(result).toEqual('updateSocial');
    });
  });

  describe('deleteSocial', () => {
    it('socialを削除する', async () => {
      socialsRepository.deleteSocial.mockResolvedValue({ affected: 1 });
      expect(socialsRepository.deleteSocial).not.toHaveBeenCalled();

      await socialsService.deleteSocial(1);
      expect(socialsRepository.deleteSocial).toHaveBeenCalled();
    });
  });

  describe('deleteSocialsByUserId', () => {
    it('userIdが一致するsocialを削除する', async () => {
      socialsRepository.deleteSocialsByUserId.mockResolvedValue({
        affected: 1,
      });
      expect(socialsRepository.deleteSocialsByUserId).not.toHaveBeenCalled();

      await socialsService.deleteSocialsByUserId(1);
      expect(socialsRepository.deleteSocialsByUserId).toHaveBeenCalled();
    });
  });
});
