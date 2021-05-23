import { Test } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { RecipeDescriptionRepository } from '../../src/recipe-descriptions/recipe-descriptions.repository';

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
});
