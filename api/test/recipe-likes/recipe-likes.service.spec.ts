import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecipeLikesService } from '../../src/recipe-likes/recipe-likes.service';
import { RecipeLikeRepository } from '../../src/recipe-likes/recipe-likes.repository';

const mockRecipeLikes = [
  {
    id: 1,
    userId: 1,
    recipeId: 1,
  },
  {
    id: 2,
    userId: 1,
    recipeId: 2,
  },
];

const mockRecipeLikeDto = {
  userId: 1,
  recipeId: 1,
};

const mockRecipeLikeRepository = () => ({
  getAllRecipeLikes: jest.fn(),
  getRecipeLikesByUserId: jest.fn(),
  getRecipeLikesByRecipeId: jest.fn(),
  recipeLike: jest.fn(),
  deleteRecipeLikes: jest.fn(),
  unlikeRecipe: jest.fn(),
});

describe('RecipeLikes Service', () => {
  let recipeLikesService;
  let recipeLikeRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RecipeLikesService,
        { provide: RecipeLikeRepository, useFactory: mockRecipeLikeRepository },
      ],
    }).compile();

    recipeLikesService = await module.get<RecipeLikesService>(
      RecipeLikesService,
    );
    recipeLikeRepository = await module.get<RecipeLikeRepository>(
      RecipeLikeRepository,
    );
  });

  describe('getAllRecipeLikes', () => {
    it('全てのrecipeLikesをrepositoryから取得する', async () => {
      recipeLikeRepository.getAllRecipeLikes = jest
        .fn()
        .mockResolvedValue(mockRecipeLikes);

      const result = await recipeLikesService.getAllRecipeLikes();
      expect(recipeLikeRepository.getAllRecipeLikes).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeLikes);
    });
  });

  describe('getRecipeLikesByUserId', () => {
    it('userIdをパラメーターとして渡し、成功するとrecipeLikesを返す', async () => {
      recipeLikeRepository.getRecipeLikesByUserId = jest
        .fn()
        .mockResolvedValue(mockRecipeLikes[1]);
      expect(
        recipeLikeRepository.getRecipeLikesByUserId,
      ).not.toHaveBeenCalled();

      const result = await recipeLikesService.getRecipeLikesByUserId(1);
      expect(recipeLikeRepository.getRecipeLikesByUserId).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeLikes[1]);
    });
  });

  describe('getRecipeLikesByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとrecipeLikesを返す', async () => {
      recipeLikeRepository.getRecipeLikesByRecipeId = jest
        .fn()
        .mockResolvedValue(mockRecipeLikes[1]);
      expect(
        recipeLikeRepository.getRecipeLikesByRecipeId,
      ).not.toHaveBeenCalled();

      const result = await recipeLikesService.getRecipeLikesByRecipeId(1);
      expect(recipeLikeRepository.getRecipeLikesByRecipeId).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeLikes[1]);
    });
  });

  describe('recipeLike', () => {
    it('recipeLikeを呼び、成功するとrecipeLikeを返す', async () => {
      recipeLikeRepository.recipeLike.mockResolvedValue('someRecipeLike');
      expect(recipeLikeRepository.recipeLike).not.toHaveBeenCalled();

      const result = await recipeLikesService.recipeLike(mockRecipeLikeDto);
      expect(result).toEqual('someRecipeLike');
    });
  });

  describe('deleteRecipeLikes', () => {
    it('recipeLikeを削除する', async () => {
      recipeLikeRepository.deleteRecipeLikes.mockResolvedValue({
        affected: 1,
      });
      expect(recipeLikeRepository.deleteRecipeLikes).not.toHaveBeenCalled();

      await recipeLikesService.deleteRecipeLikes(1);
      expect(recipeLikeRepository.deleteRecipeLikes).toHaveBeenCalled();
    });
  });

  describe('unlikeRecipe', () => {
    it('特定のuserのrecipeに対するlikeを削除する', async () => {
      recipeLikeRepository.unlikeRecipe.mockResolvedValue({
        affected: 1,
      });

      await recipeLikesService.unlikeRecipe(mockRecipeLikeDto);
      expect(recipeLikeRepository.unlikeRecipe).toHaveBeenCalled();
    });
  });
});
