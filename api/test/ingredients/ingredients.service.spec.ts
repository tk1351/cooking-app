import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { IngredientsService } from '../../src/ingredients/ingredients.service';
import { IngredientRepository } from '../../src/ingredients/ingredients.repository';
import { mockCreateIngredientDto } from './ingredient.repository.spec';

const mockIngredients = [
  {
    id: 1,
    name: 'testName',
    amount: 'testAmount',
    recipeId: 1,
  },
  {
    id: 2,
    name: 'testName2',
    amount: 'testAmount2',
    recipeId: 1,
  },
];

const mockUpdateIngredientDto = {
  name: 'updateName',
  amount: 'updateAmount',
};

const mockIngredientRepository = () => ({
  getAllIngredients: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(mockIngredients),
  })),
  createIngredient: jest.fn(),
  delete: jest.fn(),
});

describe('Ingredients Service', () => {
  let ingredientsService;
  let ingredientRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IngredientsService,
        { provide: IngredientRepository, useFactory: mockIngredientRepository },
      ],
    }).compile();

    ingredientsService = await module.get<IngredientsService>(
      IngredientsService,
    );
    ingredientRepository = await module.get<IngredientRepository>(
      IngredientRepository,
    );
  });

  describe('getAllIngredients', () => {
    it('全てのingredientsをrepositoryから取得する', async () => {
      ingredientsService.getAllIngredients = jest
        .fn()
        .mockResolvedValue(mockIngredients);
      expect(ingredientsService.getAllIngredients).not.toHaveBeenCalled();

      const result = await ingredientsService.getAllIngredients();
      expect(ingredientsService.getAllIngredients).toHaveBeenCalled();
      expect(result).toEqual(mockIngredients);
    });
  });

  describe('getIngredientById', () => {
    it('ingredientRepository.findOne()を呼び、成功するとingredientを返す', async () => {
      ingredientRepository.findOne.mockResolvedValue(mockIngredients[0]);

      const result = await ingredientsService.getIngredientById(1);
      expect(result).toEqual(mockIngredients[0]);
      expect(ingredientRepository.findOne).toHaveBeenCalledWith(1);
    });

    it('ingredientが無い場合、errorを返す', () => {
      ingredientRepository.findOne.mockResolvedValue(null);
      expect(ingredientsService.getIngredientById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getIngredientByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとingredientを返す', async () => {
      const result = await ingredientsService.getIngredientByRecipeId(1);
      expect(result).toEqual(mockIngredients);
    });
  });

  describe('createIngredient', () => {
    it('ingredientRepository.createIngredient()を呼び、成功するとingredientを返す', async () => {
      ingredientRepository.createIngredient.mockResolvedValue('someIngredient');
      expect(ingredientRepository.createIngredient).not.toHaveBeenCalled();

      const result = await ingredientsService.createIngredient(
        mockCreateIngredientDto,
      );
      expect(result).toEqual('someIngredient');
      const { name, amount, recipe, createdAt, updatedAt } =
        mockCreateIngredientDto;
      expect(ingredientRepository.createIngredient).toHaveBeenCalledWith({
        name,
        amount,
        recipe,
        createdAt,
        updatedAt,
      });
    });
  });

  describe('updateIngredient', () => {
    it('ingredientを更新する', async () => {
      const save = jest.fn().mockResolvedValue(true);

      ingredientsService.getIngredientById = jest.fn().mockResolvedValue({
        id: 1,
        mockUpdateIngredientDto,
        save,
      });

      expect(ingredientsService.getIngredientById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await ingredientsService.updateIngredient(
        1,
        mockUpdateIngredientDto,
      );
      expect(ingredientsService.getIngredientById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.mockUpdateIngredientDto).toEqual(mockUpdateIngredientDto);
    });
  });

  describe('deleteIngredient', () => {
    it('ingredientを削除する', async () => {
      ingredientRepository.delete.mockResolvedValue({
        affected: 1,
      });
      expect(ingredientRepository.delete).not.toHaveBeenCalled();

      await ingredientsService.deleteIngredient(1);
      expect(ingredientRepository.delete).toHaveBeenCalled();
    });

    it('ingredientが無い場合は、errorを返す', async () => {
      ingredientRepository.delete.mockResolvedValue({
        affected: 0,
      });

      expect(ingredientsService.deleteIngredient(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
