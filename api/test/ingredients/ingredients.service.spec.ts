import { Test } from '@nestjs/testing';
import { IngredientsService } from '../../src/ingredients/ingredients.service';
import { IngredientRepository } from '../../src/ingredients/ingredients.repository';
import { mockCreateIngredientDto } from './ingredients.repository.spec';

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
  getIngredientById: jest.fn(),
  getIngredientByRecipeId: jest.fn(),
  createIngredient: jest.fn(),
  updateIngredient: jest.fn(),
  deleteIngredient: jest.fn(),
  deleteIngredientsByRecipeId: jest.fn(),
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
      ingredientRepository.getAllIngredients.mockResolvedValue(mockIngredients);

      const result = await ingredientsService.getAllIngredients();
      expect(ingredientRepository.getAllIngredients).toHaveBeenCalled();
      expect(result).toEqual(mockIngredients);
    });
  });

  describe('getIngredientById', () => {
    it('getIngredientByIdを呼び、成功するとingredientを返す', async () => {
      ingredientRepository.getIngredientById.mockResolvedValue(
        mockIngredients[0],
      );

      const result = await ingredientsService.getIngredientById(1);
      expect(result).toEqual(mockIngredients[0]);
      expect(ingredientRepository.getIngredientById).toHaveBeenCalledWith(1);
    });
  });

  describe('getIngredientByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとingredientを返す', async () => {
      ingredientRepository.getIngredientByRecipeId.mockResolvedValue(
        mockIngredients[0],
      );

      const result = await ingredientsService.getIngredientByRecipeId(1);
      expect(ingredientRepository.getIngredientByRecipeId).toHaveBeenCalled();
      expect(result).toEqual(mockIngredients[0]);
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
    });
  });

  describe('updateIngredient', () => {
    it('ingredientを更新する', async () => {
      ingredientRepository.updateIngredient.mockResolvedValue(
        'updateIngredient',
      );
      expect(ingredientRepository.updateIngredient).not.toHaveBeenCalled();

      const result = await ingredientsService.updateIngredient(
        1,
        mockUpdateIngredientDto,
      );

      expect(ingredientRepository.updateIngredient).toHaveBeenCalled();
      expect(result).toEqual('updateIngredient');
    });
  });

  describe('deleteIngredient', () => {
    it('ingredientを削除する', async () => {
      ingredientRepository.deleteIngredient.mockResolvedValue({
        affected: 1,
      });
      expect(ingredientRepository.deleteIngredient).not.toHaveBeenCalled();

      await ingredientsService.deleteIngredient(1);
      expect(ingredientRepository.deleteIngredient).toHaveBeenCalled();
    });
  });

  describe('deleteIngredientsByRecipeId', () => {
    it('recipeIdが一致するingredientを削除する', async () => {
      ingredientRepository.deleteIngredientsByRecipeId.mockResolvedValue({
        affected: 1,
      });
      expect(
        ingredientRepository.deleteIngredientsByRecipeId,
      ).not.toHaveBeenCalled();

      await ingredientsService.deleteIngredientsByRecipeId(1);
      expect(
        ingredientRepository.deleteIngredientsByRecipeId,
      ).toHaveBeenCalled();
    });
  });
});
