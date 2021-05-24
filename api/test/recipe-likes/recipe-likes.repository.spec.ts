import { Test } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    recipeId: 1,
  },
];

const mockRecipeLikeDto = {
  userId: 1,
  recipeId: 1,
};

describe('RecipeLikesRepository', () => {
  let recipeLikesRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RecipeLikeRepository],
    }).compile();

    recipeLikesRepository = await module.get<RecipeLikeRepository>(
      RecipeLikeRepository,
    );
  });

  describe('getAllRecipeLikes', () => {
    it('getAllRecipeLikesに成功', async () => {
      recipeLikesRepository.find = jest.fn().mockResolvedValue(mockRecipeLikes);
      expect(recipeLikesRepository.find).not.toHaveBeenCalled();

      const result = await recipeLikesRepository.getAllRecipeLikes();
      expect(recipeLikesRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeLikes);
    });
  });

  describe('getRecipeLikesByUserId', () => {
    it('getRecipeLikesByUserIdに成功すると、該当するrecipeLikeを返す', async () => {
      const getMany = jest.fn().mockReturnValue(mockRecipeLikes);
      const where = jest.fn(() => ({ getMany }));
      recipeLikesRepository.createQueryBuilder = jest.fn(() => ({ where }));

      const result = await recipeLikesRepository.getRecipeLikesByUserId(1);
      expect(recipeLikesRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeLikes);
    });
  });

  describe('getRecipeLikesByRecipeId', () => {
    it('getRecipeLikesByRecipeIdに成功すると、該当するrecipeLikeを返す', async () => {
      const getMany = jest.fn().mockReturnValue(mockRecipeLikes);
      const where = jest.fn(() => ({ getMany }));
      recipeLikesRepository.createQueryBuilder = jest.fn(() => ({ where }));

      const result = await recipeLikesRepository.getRecipeLikesByRecipeId(1);
      expect(recipeLikesRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockRecipeLikes);
    });
  });

  describe('recipeLike', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      recipeLikesRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('recipeLikeに成功', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        recipeLikesRepository.recipeLike(mockRecipeLikeDto),
      ).resolves.not.toThrow();
    });

    it('recipeLikeに失敗した場合、errorを返す', async () => {
      save.mockRejectedValue({ code: '111' });
      await expect(
        recipeLikesRepository.recipeLike(mockRecipeLikeDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteRecipeLikes', () => {
    beforeEach(() => {
      recipeLikesRepository.delete = jest.fn();
    });

    it('likesを削除する', async () => {
      recipeLikesRepository.delete.mockResolvedValue({ affected: 1 });
      expect(recipeLikesRepository.delete).not.toHaveBeenCalled();

      await recipeLikesRepository.deleteRecipeLikes(1);
      expect(recipeLikesRepository.delete).toHaveBeenCalled();
    });

    it('likeが無い場合は、errorを返す', async () => {
      recipeLikesRepository.delete.mockResolvedValue({ affected: 0 });

      expect(recipeLikesRepository.deleteRecipeLikes(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('unlikeRecipe', () => {
    it('recipeをunlikeする', async () => {
      recipeLikesRepository.delete = jest
        .fn()
        .mockResolvedValue({ affected: 1 });
      await recipeLikesRepository.unlikeRecipe(mockRecipeLikeDto);
      expect(recipeLikesRepository.delete).toHaveBeenCalled();
    });
  });
});
