import { Test } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { TagRepository } from '../../src/tags/tags.repository';

export const mockCreateTagDto = {
  name: 'testName',
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

describe('TagRepository', () => {
  let tagRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TagRepository],
    }).compile();

    tagRepository = await module.get<TagRepository>(TagRepository);
  });

  describe('createTag', () => {
    let save;

    beforeEach(() => {
      (save = jest.fn()),
        (tagRepository.create = jest.fn().mockReturnValue({ save }));
    });

    it('createTagに成功', async () => {
      save.mockResolvedValue(undefined);
      await expect(
        tagRepository.createTag(mockCreateTagDto),
      ).resolves.not.toThrow();
    });

    it('createTagに失敗した場合、errorを返す', async () => {
      save.mockRejectedValue({ code: '111' });
      await expect(tagRepository.createTag(mockCreateTagDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
