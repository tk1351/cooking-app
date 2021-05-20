import { Test } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { IngredientRepository } from '../../src/ingredients/ingredient.repository';

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
});
