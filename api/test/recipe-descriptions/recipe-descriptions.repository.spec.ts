import { Test } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RecipeDescriptionRepository } from '../../src/recipe-descriptions/recipe-descriptions.repository';

const mockRecipeDescriptions = [
  {
    id: 1,
    order: 1,
    text: 'testText',
    recipe: {
      id: 1,
      name: 'testName',
      time: 5,
      remarks: 'testRemarks',
      image: 'testImage',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    order: 2,
    text: 'testText2',
    recipe: {
      id: 1,
      name: 'testName',
      time: 5,
      remarks: 'testRemarks',
      image: 'testImage',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUpdateRecipeDescriptionDto = {
  order: 2,
  text: 'updateText',
  recipe: {
    id: 1,
    name: 'testName',
    time: 5,
    remarks: 'testRemarks',
    image: 'testImage',
  },
};

export const mockCreateRecipeDescriptionDto = {
  order: 1,
  text: 'testText',
  recipe: {
    id: 1,
    name: 'testName',
    time: 5,
    remarks: 'testRemarks',
    image: 'testImage',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('RecipeDescriptionRepository', () => {
  let recipeDescriptionRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RecipeDescriptionRepository],
    }).compile();

    recipeDescriptionRepository = await module.get<RecipeDescriptionRepository>(
      RecipeDescriptionRepository,
    );
  });

  describe('getAllRecipeDescriptions', () => {
    it('getAllRecipeDescriptionsに成功する', async () => {
      recipeDescriptionRepository.find = jest
        .fn()
        .mockResolvedValue(mockRecipeDescriptions);
      expect(recipeDescriptionRepository.find).not.toHaveBeenCalled();

      const result =
        await recipeDescriptionRepository.getAllRecipeDescriptions();
      expect(recipeDescriptionRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeDescriptions);
    });
  });

  describe('getRecipeDescriptionById', () => {
    it('getRecipeDescriptionByIdに成功すると、該当のrecipe-descriptionを返す', async () => {
      recipeDescriptionRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockRecipeDescriptions[0]);
      expect(recipeDescriptionRepository.findOne).not.toHaveBeenCalled();

      const result = await recipeDescriptionRepository.getRecipeDescriptionById(
        1,
      );
      expect(recipeDescriptionRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeDescriptions[0]);
    });
  });

  describe('getRecipeDescriptionsByRecipeId', () => {
    it('getRecipeDescriptionsByRecipeIdに成功すると、該当のrecipe-descriptionを返す', async () => {
      const getMany = jest.fn().mockResolvedValue(mockRecipeDescriptions);
      const where = jest.fn(() => ({ getMany }));
      recipeDescriptionRepository.createQueryBuilder = jest.fn(() => ({
        where,
      }));

      const result =
        await recipeDescriptionRepository.getRecipeDescriptionsByRecipeId(1);
      expect(recipeDescriptionRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeDescriptions);
    });
  });

  describe('createRecipeDescription', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      recipeDescriptionRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('createRecipeDescriptionに成功', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        recipeDescriptionRepository.createRecipeDescription(
          mockCreateRecipeDescriptionDto,
        ),
      ).resolves.not.toThrow();
    });

    it('createRecipeDescriptionに失敗した場合, errorを返す', async () => {
      save.mockRejectedValue({ code: '111' });
      await expect(
        recipeDescriptionRepository.createRecipeDescription(
          mockCreateRecipeDescriptionDto,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateRecipeDescription', () => {
    it('updateRecipeDescriptionに成功', async () => {
      const save = jest.fn().mockResolvedValue(true);

      recipeDescriptionRepository.getRecipeDescriptionById = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          mockUpdateRecipeDescriptionDto,
          save,
        });
      expect(
        recipeDescriptionRepository.getRecipeDescriptionById,
      ).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await recipeDescriptionRepository.updateRecipeDescription(
        1,
        mockUpdateRecipeDescriptionDto,
      );
      expect(
        recipeDescriptionRepository.getRecipeDescriptionById,
      ).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.mockUpdateRecipeDescriptionDto).toEqual(
        mockUpdateRecipeDescriptionDto,
      );
    });
  });

  describe('deleteRecipeDescription', () => {
    beforeEach(() => {
      recipeDescriptionRepository.delete = jest.fn();
    });

    it('recipe-descriptionを削除する', async () => {
      recipeDescriptionRepository.delete.mockResolvedValue({ affected: 1 });
      expect(recipeDescriptionRepository.delete).not.toHaveBeenCalled();

      await recipeDescriptionRepository.deleteRecipeDescription(1);
      expect(recipeDescriptionRepository.delete).toHaveBeenCalled();
    });

    it('recipe-descriptionが無い場合は、errorを返す', async () => {
      recipeDescriptionRepository.delete.mockResolvedValue({ affected: 0 });

      expect(
        recipeDescriptionRepository.deleteRecipeDescription(1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteRecipeDescriptionsByRecipeId', () => {
    it('recipeIdが一致するrecipe-descriptionsを削除する', async () => {
      recipeDescriptionRepository.getRecipeDescriptionsByRecipeId = jest
        .fn()
        .mockResolvedValue(mockRecipeDescriptions);
      recipeDescriptionRepository.delete = jest
        .fn()
        .mockResolvedValue({ affected: 1 });
      expect(
        recipeDescriptionRepository.getRecipeDescriptionsByRecipeId,
      ).not.toHaveBeenCalled();
      expect(recipeDescriptionRepository.delete).not.toHaveBeenCalled();

      await recipeDescriptionRepository.deleteRecipeDescriptionsByRecipeId(1);
      expect(
        recipeDescriptionRepository.getRecipeDescriptionsByRecipeId,
      ).toHaveBeenCalled();
      expect(recipeDescriptionRepository.delete).toHaveBeenCalled();
    });
  });
});
