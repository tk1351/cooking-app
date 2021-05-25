import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecipeDescriptionsService } from '../../src/recipe-descriptions/recipe-descriptions.service';
import { RecipeDescriptionRepository } from '../../src/recipe-descriptions/recipe-descriptions.repository';
import { mockCreateRecipeDescriptionDto } from './recipe-descriptions.repository.spec';

const mockRecipeDescriptions = [
  {
    id: 1,
    order: 1,
    text: 'testText',
    recipeId: 1,
  },
  {
    id: 2,
    order: 2,
    text: 'testText2',
    recipeId: 1,
  },
];

const mockUpdateRecipeDescriptionDto = {
  order: 5,
  text: 'updateText',
};

const mockRecipeDescriptionRepository = () => ({
  getAllRecipeDescriptions: jest.fn(),
  getRecipeDescriptionById: jest.fn(),
  getRecipeDescriptionsByRecipeId: jest.fn(),
  createRecipeDescription: jest.fn(),
  updateRecipeDescription: jest.fn(),
  deleteRecipeDescription: jest.fn(),
  deleteRecipeDescriptionsByRecipeId: jest.fn(),
});

describe('RecipeDescriptions Service', () => {
  let recipeDescriptionsService;
  let recipeDescriptionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RecipeDescriptionsService,
        {
          provide: RecipeDescriptionRepository,
          useFactory: mockRecipeDescriptionRepository,
        },
      ],
    }).compile();

    recipeDescriptionsService = await module.get<RecipeDescriptionsService>(
      RecipeDescriptionsService,
    );
    recipeDescriptionRepository = await module.get<RecipeDescriptionRepository>(
      RecipeDescriptionRepository,
    );
  });

  describe('getAllRecipeDescriptions', () => {
    it('全てのrecipeDescriptionsをrepositoryから取得する', async () => {
      recipeDescriptionRepository.getAllRecipeDescriptions.mockResolvedValue(
        mockRecipeDescriptions,
      );

      const result = await recipeDescriptionsService.getAllRecipeDescriptions();
      expect(
        recipeDescriptionRepository.getAllRecipeDescriptions,
      ).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeDescriptions);
    });
  });

  describe('getRecipeDescriptionById', () => {
    it('getRecipeDescriptionByIdを呼び、成功するとrecipeDescriptionを返す', async () => {
      recipeDescriptionRepository.getRecipeDescriptionById.mockResolvedValue(
        mockRecipeDescriptions[0],
      );

      const result = await recipeDescriptionsService.getRecipeDescriptionById(
        1,
      );
      expect(result).toEqual(mockRecipeDescriptions[0]);
      expect(
        recipeDescriptionRepository.getRecipeDescriptionById,
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('getRecipeDescriptionsByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとrecipeDescriptionを返す', async () => {
      recipeDescriptionRepository.getRecipeDescriptionsByRecipeId.mockResolvedValue(
        mockRecipeDescriptions[0],
      );

      const result =
        await recipeDescriptionsService.getRecipeDescriptionsByRecipeId(1);
      expect(
        recipeDescriptionRepository.getRecipeDescriptionsByRecipeId,
      ).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeDescriptions[0]);
    });
  });

  describe('createRecipeDescription', () => {
    it('recipeDescriptionRepository.createRecipeDescription()を呼び、成功するとrecipeDescriptionを返す', async () => {
      recipeDescriptionRepository.createRecipeDescription.mockResolvedValue(
        'someRecipeDesc',
      );
      expect(
        recipeDescriptionRepository.createRecipeDescription,
      ).not.toHaveBeenCalled();

      const result = await recipeDescriptionsService.createRecipeDescription(
        mockCreateRecipeDescriptionDto,
      );
      expect(result).toEqual('someRecipeDesc');
    });
  });

  describe('updateRecipeDescription', () => {
    it('recipeDescriptionを更新する', async () => {
      recipeDescriptionRepository.updateRecipeDescription.mockResolvedValue(
        'updateRecipeDescription',
      );
      expect(
        recipeDescriptionRepository.updateRecipeDescription,
      ).not.toHaveBeenCalled();

      const result = await recipeDescriptionsService.updateRecipeDescription(
        1,
        mockUpdateRecipeDescriptionDto,
      );
      expect(
        recipeDescriptionRepository.updateRecipeDescription,
      ).toHaveBeenCalled();
      expect(result).toEqual('updateRecipeDescription');
    });
  });

  describe('deleteRecipeDescription', () => {
    it('recipeDescriptionを削除する', async () => {
      recipeDescriptionRepository.deleteRecipeDescription.mockResolvedValue({
        affected: 1,
      });
      expect(
        recipeDescriptionRepository.deleteRecipeDescription,
      ).not.toHaveBeenCalled();

      await recipeDescriptionsService.deleteRecipeDescription(1);
      expect(
        recipeDescriptionRepository.deleteRecipeDescription,
      ).toHaveBeenCalled();
    });
  });

  describe('deleteRecipeDescriptionsByRecipeId', () => {
    it('recipeIdが一致するrecipe-descriptionを削除する', async () => {
      recipeDescriptionRepository.deleteRecipeDescriptionsByRecipeId.mockResolvedValue(
        {
          affected: 1,
        },
      );
      expect(
        recipeDescriptionRepository.deleteRecipeDescriptionsByRecipeId,
      ).not.toHaveBeenCalled();

      await recipeDescriptionsService.deleteRecipeDescriptionsByRecipeId(1);
      expect(
        recipeDescriptionRepository.deleteRecipeDescriptionsByRecipeId,
      ).toHaveBeenCalled();
    });
  });
});
