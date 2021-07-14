import { Test } from '@nestjs/testing';
import { RecipesService } from '../../src/recipes/recipes.service';
import { RecipeRepository } from '../../src/recipes/recipes.repository';
import { RecipeLikesService } from '../../src/recipe-likes/recipe-likes.service';
import { IngredientsService } from '../../src/ingredients/ingredients.service';
import { RecipeDescriptionsService } from '../../src/recipe-descriptions/recipe-descriptions.service';
import { TagsService } from '../../src/tags/tags.service';
import { UsersService } from '../../src/users/users.service';

const mockRecipes = [
  {
    id: '1',
    name: 'testName',
    order: 5,
    url: 'https://',
    remarks: 'test',
    image: 'test',
  },
  {
    id: '2',
    name: 'testName2',
    order: 5,
    url: 'https://2',
    remarks: 'test2',
    image: 'test2',
  },
];

const mockRecipeRepostitory = () => ({
  getRecipes: jest.fn(),
  getRecipesFilter: jest.fn(),
  getRecipesByLimitNumber: jest.fn(),
  getRecipesByOffset: jest.fn(),
  getRecipeById: jest.fn(),
});

const mockRecipeLikesRepository = () => ({});
const mockIngredientsService = () => ({});
const mockRecipeDescriptionsService = () => ({});
const mockTagsService = () => ({});
const mockUsersService = () => ({});

describe('Recipes Service', () => {
  let recipesService;
  let recipeRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: RecipeRepository, useFactory: mockRecipeRepostitory },
        { provide: RecipeLikesService, useFactory: mockRecipeLikesRepository },
        { provide: IngredientsService, useFactory: mockIngredientsService },
        {
          provide: RecipeDescriptionsService,
          useFactory: mockRecipeDescriptionsService,
        },
        { provide: TagsService, useFactory: mockTagsService },
        { provide: UsersService, useFactory: mockUsersService },
      ],
    }).compile();

    recipesService = module.get<RecipesService>(RecipesService);
    recipeRepository = module.get<RecipeRepository>(RecipeRepository);
  });

  describe('getRecipes', () => {
    it('全てのrecipeをrepositoryから取得する', async () => {
      recipeRepository.getRecipes = jest.fn().mockResolvedValue(mockRecipes);

      const mockGetRecipesFilterDto = { query: '' };

      const result = await recipesService.getRecipes(mockGetRecipesFilterDto);
      expect(recipeRepository.getRecipes).toHaveBeenCalled();
      expect(result).toEqual(mockRecipes);
    });
  });

  describe('getRecipesFilter', () => {
    it('filterに応じてrecipeを取得する', async () => {
      recipeRepository.getRecipesFilter = jest
        .fn()
        .mockResolvedValue(mockRecipes[0]);

      const mockGetRecipesFilterDto = {
        query: 'testName',
        limit: 1,
        start: 0,
      };

      const result = await recipesService.getRecipesFilter(
        mockGetRecipesFilterDto,
      );
      expect(recipeRepository.getRecipesFilter).toHaveBeenCalled();
      expect(result).toEqual(mockRecipes[0]);
    });
  });

  describe('getRecipesByLimitNumber', () => {
    it('limitに応じてrecipeを取得する', async () => {
      recipeRepository.getRecipesByLimitNumber = jest
        .fn()
        .mockResolvedValue(mockRecipes[0]);

      const mockGetRecipesFilterDto = {
        query: '',
        limit: 1,
        start: 0,
      };

      const result = await recipesService.getRecipesByLimitNumber(
        mockGetRecipesFilterDto,
      );
      expect(recipeRepository.getRecipesByLimitNumber).toHaveBeenCalled();
      expect(result).toEqual(mockRecipes[0]);
    });
  });

  describe('getRecipesByOffset', () => {
    it('startとlimitに応じてrecipeを取得する', async () => {
      recipeRepository.getRecipesByOffset = jest
        .fn()
        .mockResolvedValue(mockRecipes[1]);

      const mockGetRecipesFilterDto = {
        query: '',
        limit: 1,
        start: 1,
      };
      const result = await recipesService.getRecipesByOffset(
        mockGetRecipesFilterDto,
      );
      expect(recipeRepository.getRecipesByOffset).toHaveBeenCalled();
      expect(result).toEqual(mockRecipes[1]);
    });
  });

  describe('getRecipeById', () => {
    it('idに応じてrecipeを取得する', async () => {
      recipeRepository.getRecipeById = jest
        .fn()
        .mockResolvedValue(mockRecipes[0]);

      const result = await recipesService.getRecipeById(1);
      expect(recipeRepository.getRecipeById).toHaveBeenCalled();
      expect(result).toEqual(mockRecipes[0]);
    });
  });
});
