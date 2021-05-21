import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecipeLikesService } from '../../src/recipe-likes/recipe-likes.service';
import { RecipeLikeRepository } from '../../src/recipe-likes/recipe-like.repository';

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
  recipeLike: jest.fn(),
  delete: jest.fn(),
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
      recipeLikesService.getAllRecipeLikes = jest
        .fn()
        .mockResolvedValue(mockRecipeLikes);
      expect(recipeLikesService.getAllRecipeLikes).not.toHaveBeenCalled();

      const result = await recipeLikesService.getAllRecipeLikes();
      expect(recipeLikesService.getAllRecipeLikes).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeLikes);
    });
  });

  describe('getRecipeLikesByUserId', () => {
    it('userIdをパラメーターとして渡し、成功するとrecipeLikesを返す', async () => {
      recipeLikesService.getRecipeLikesByUserId = jest
        .fn()
        .mockResolvedValue(1);
      expect(recipeLikesService.getRecipeLikesByUserId).not.toHaveBeenCalled();

      const result = await recipeLikesService.getRecipeLikesByUserId();
      expect(recipeLikesService.getRecipeLikesByUserId).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  });

  describe('getRecipeLikesByRecipeId', () => {
    it('recipeIdをパラメーターとして渡し、成功するとrecipeLikesを返す', async () => {
      recipeLikesService.getRecipeLikesByRecipeId = jest
        .fn()
        .mockResolvedValue(1);
      expect(
        recipeLikesService.getRecipeLikesByRecipeId,
      ).not.toHaveBeenCalled();

      const result = await recipeLikesService.getRecipeLikesByRecipeId();
      expect(recipeLikesService.getRecipeLikesByRecipeId).toHaveBeenCalled();
      expect(result).toEqual(1);
    });
  });

  describe('postLike', () => {
    it('recipeLikeRepository.create()を呼び、成功するとrecipeLikeを返す', async () => {
      recipeLikeRepository.recipeLike.mockResolvedValue('someRecipeLike');
      expect(recipeLikeRepository.recipeLike).not.toHaveBeenCalled();

      const result = await recipeLikesService.recipeLike(mockRecipeLikeDto);
      expect(result).toEqual('someRecipeLike');
      const { userId, recipeId } = mockRecipeLikeDto;

      expect(recipeLikeRepository.recipeLike).toHaveBeenCalledWith({
        userId,
        recipeId,
      });
    });
  });

  describe('deleteRecipeLikes', () => {
    it('recipeLikeを削除する', async () => {
      recipeLikeRepository.delete.mockResolvedValue({
        affected: 1,
      });
      expect(recipeLikeRepository.delete).not.toHaveBeenCalled();

      await recipeLikesService.deleteRecipeLikes(1);
      expect(recipeLikeRepository.delete).toHaveBeenCalled();
    });

    it('recipeLikeが無い場合は、errorを返す', async () => {
      recipeLikeRepository.delete.mockResolvedValue({
        affected: 0,
      });

      expect(recipeLikesService.deleteRecipeLikes(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('unlikeRecipe', () => {
    it('特定のuserのrecipeに対するlikeを削除する', async () => {
      recipeLikeRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await recipeLikesService.unlikeRecipe(1, 1);
      expect(recipeLikeRepository.delete).toHaveBeenCalled();
    });
  });
});
