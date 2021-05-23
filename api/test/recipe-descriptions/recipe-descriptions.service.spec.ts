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
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockRecipeDescriptions),
  })),
  createRecipeDescription: jest.fn(),
  delete: jest.fn(),
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
      recipeDescriptionsService.getAllRecipeDescriptions = jest
        .fn()
        .mockResolvedValue(mockRecipeDescriptions);
      expect(
        recipeDescriptionsService.getAllRecipeDescriptions,
      ).not.toHaveBeenCalled();

      const result = await recipeDescriptionsService.getAllRecipeDescriptions();
      expect(
        recipeDescriptionsService.getAllRecipeDescriptions,
      ).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeDescriptions);
    });
  });

  describe('getRecipeDescriptionById', () => {
    it('recipeDescriptionRepository.findOne()を呼び、成功するとrecipeDescriptionを返す', async () => {
      recipeDescriptionRepository.findOne.mockResolvedValue(
        mockRecipeDescriptions[0],
      );

      const result = await recipeDescriptionsService.getRecipeDescriptionById(
        1,
      );
      expect(result).toEqual(mockRecipeDescriptions[0]);
      expect(recipeDescriptionRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('recipeDescriptionが無い場合、errorを返す', () => {
      recipeDescriptionRepository.findOne.mockResolvedValue(null);
      expect(
        recipeDescriptionsService.getRecipeDescriptionById(1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRecipeDescriptionsByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとrecipeDescriptionを返す', async () => {
      const result =
        await recipeDescriptionsService.getRecipeDescriptionsByRecipeId(1);
      expect(result).toEqual(mockRecipeDescriptions);
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
      const { order, text, recipe, createdAt, updatedAt } =
        mockCreateRecipeDescriptionDto;

      expect(
        recipeDescriptionRepository.createRecipeDescription,
      ).toHaveBeenCalledWith({
        order,
        text,
        recipe,
        createdAt,
        updatedAt,
      });
    });
  });

  describe('updateRecipeDescription', () => {
    it('recipeDescriptionを更新する', async () => {
      const save = jest.fn().mockResolvedValue(true);

      recipeDescriptionsService.getRecipeDescriptionById = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          mockUpdateRecipeDescriptionDto,
          save,
        });

      expect(
        recipeDescriptionsService.getRecipeDescriptionById,
      ).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await recipeDescriptionsService.updateRecipeDescription(
        1,
        mockUpdateRecipeDescriptionDto,
      );
      expect(
        recipeDescriptionsService.getRecipeDescriptionById,
      ).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result).toEqual({ message: '作業工程の詳細の更新が完了しました' });
    });
  });

  describe('deleteRecipeDescription', () => {
    it('recipeDescriptionを削除する', async () => {
      recipeDescriptionRepository.delete.mockResolvedValue({
        affected: 1,
      });
      expect(recipeDescriptionRepository.delete).not.toHaveBeenCalled();

      await recipeDescriptionsService.deleteRecipeDescription(1);
      expect(recipeDescriptionRepository.delete).toHaveBeenCalled();
    });

    it('recipeDescriptionが無い場合は、errorを返す', async () => {
      recipeDescriptionRepository.delete.mockResolvedValue({
        affected: 0,
      });

      expect(
        recipeDescriptionsService.deleteRecipeDescription(1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
