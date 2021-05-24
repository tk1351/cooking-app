import { Test } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IngredientRepository } from '../../src/ingredients/ingredients.repository';

const mockIngredients = [
  {
    id: 1,
    name: 'testName',
    amount: 'testAmount',
    recipeId: 1,
  },
  {
    id: 2,
    name: 'testName',
    amount: 'testAmount',
    recipeId: 1,
  },
];

const mockUpdateIngredientsDto = {
  name: 'updateName',
  amount: 'updateAmount',
  recipe: {
    id: 1,
    name: 'testName',
    time: 5,
    remarks: 'testRemarks',
    image: 'testImage',
  },
};

export const mockCreateIngredientDto = {
  name: 'testName',
  amount: 'testAmount',
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

describe('IngredientRepository', () => {
  let ingredientRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [IngredientRepository],
    }).compile();

    ingredientRepository = await module.get<IngredientRepository>(
      IngredientRepository,
    );
  });

  describe('getAllIngredients', () => {
    it('getAllIngredientsに成功', async () => {
      ingredientRepository.find = jest.fn().mockResolvedValue(mockIngredients);
      expect(ingredientRepository.find).not.toHaveBeenCalled();

      const result = await ingredientRepository.getAllIngredients();
      expect(ingredientRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockIngredients);
    });
  });

  describe('getIngredientById', () => {
    it('getIngredientByIdに成功すると、該当のingredientを返す', async () => {
      ingredientRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockIngredients[0]);
      expect(ingredientRepository.findOne).not.toHaveBeenCalled();

      const result = await ingredientRepository.getIngredientById(1);
      expect(ingredientRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockIngredients[0]);
    });
  });

  describe('getIngredientByRecipeId', () => {
    it('getIngredientByRecipeIdに成功すると、該当のingredientsを返す', async () => {
      const getMany = jest.fn().mockResolvedValue(mockIngredients);
      const where = jest.fn(() => ({ getMany }));
      ingredientRepository.createQueryBuilder = jest.fn(() => ({ where }));

      const result = await ingredientRepository.getIngredientByRecipeId(1);
      expect(ingredientRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockIngredients);
    });
  });

  describe('createIngredient', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      ingredientRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('createIngredientに成功', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        ingredientRepository.createIngredient(mockCreateIngredientDto),
      ).resolves.not.toThrow();
    });

    it('createIngredientに失敗した場合、errorを返す', async () => {
      save.mockRejectedValue({ code: '111' });
      await expect(
        ingredientRepository.createIngredient(mockCreateIngredientDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateIngredient', () => {
    it('updateIngredientに成功', async () => {
      const save = jest.fn().mockResolvedValue(true);

      ingredientRepository.getIngredientById = jest.fn().mockResolvedValue({
        id: 1,
        mockUpdateIngredientsDto,
        save,
      });
      expect(ingredientRepository.getIngredientById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await ingredientRepository.updateIngredient(
        1,
        mockUpdateIngredientsDto,
      );
      expect(ingredientRepository.getIngredientById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.mockUpdateIngredientsDto).toEqual(mockUpdateIngredientsDto);
    });
  });

  describe('deleteIngredient', () => {
    beforeEach(() => {
      ingredientRepository.delete = jest.fn();
    });

    it('ingredientを削除する', async () => {
      ingredientRepository.delete.mockResolvedValue({ affected: 1 });
      expect(ingredientRepository.delete).not.toHaveBeenCalled();

      await ingredientRepository.deleteIngredient(1);
      expect(ingredientRepository.delete).toHaveBeenCalled();
    });

    it('ingredientが無い場合は、errorを返す', async () => {
      ingredientRepository.delete.mockResolvedValue({ affected: 0 });

      expect(ingredientRepository.deleteIngredient(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteIngredientsByRecipeId', () => {
    it('recipeIdが一致するingredientsを削除する', async () => {
      ingredientRepository.getIngredientByRecipeId = jest
        .fn()
        .mockResolvedValue(mockIngredients);
      ingredientRepository.delete = jest
        .fn()
        .mockResolvedValue({ affected: 1 });
      expect(
        ingredientRepository.getIngredientByRecipeId,
      ).not.toHaveBeenCalled();
      expect(ingredientRepository.delete).not.toHaveBeenCalled();

      await ingredientRepository.deleteIngredientsByRecipeId(1),
        expect(ingredientRepository.getIngredientByRecipeId).toHaveBeenCalled();
      expect(ingredientRepository.delete).toHaveBeenCalled();
    });
  });
});
