import { Test } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TagRepository } from '../../src/tags/tags.repository';

const mockTags = [
  {
    id: 1,
    name: 'testTag',
    recipe: {
      id: 1,
      name: 'testName',
      time: 5,
      remarks: 'testRemarks',
      image: 'testImage',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'testTag2',
    recipe: {
      id: 1,
      name: 'testName',
      time: 5,
      remarks: 'testRemarks',
      image: 'testImage',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockUpdateTagDto = {
  name: 'updateTag',
};

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

  describe('getAllTags', () => {
    it('getAllTagsに成功', async () => {
      tagRepository.find = jest.fn().mockResolvedValue(mockTags);
      expect(tagRepository.find).not.toHaveBeenCalled();

      const result = await tagRepository.getAllTags();
      expect(tagRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockTags);
    });
  });

  describe('getTagById', () => {
    it('getTagByIdに成功すると、該当するtagを返す', async () => {
      tagRepository.findOne = jest.fn().mockResolvedValue(mockTags[0]);
      expect(tagRepository.findOne).not.toHaveBeenCalled();

      const result = await tagRepository.getTagById(1);
      expect(tagRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockTags[0]);
    });
  });

  describe('getTagsByRecipeId', () => {
    it('getTagsByRecipeIdに成功すると、該当するtagsを返す', async () => {
      const getMany = jest.fn().mockResolvedValue(mockTags);
      const where = jest.fn(() => ({ getMany }));
      tagRepository.createQueryBuilder = jest.fn(() => ({ where }));

      const result = await tagRepository.getTagsByRecipeId(1);
      expect(tagRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockTags);
    });
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

  describe('updateTag', () => {
    it('updateTagに成功', async () => {
      const save = jest.fn().mockResolvedValue(true);

      tagRepository.getTagById = jest.fn().mockResolvedValue({
        id: 1,
        mockUpdateTagDto,
        save,
      });
      expect(tagRepository.getTagById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      const result = await tagRepository.updateTag(1, mockUpdateTagDto);
      expect(tagRepository.getTagById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.mockUpdateTagDto).toEqual(mockUpdateTagDto);
    });
  });

  describe('deleteTag', () => {
    beforeEach(() => {
      tagRepository.delete = jest.fn();
    });

    it('tagを削除する', async () => {
      tagRepository.delete.mockResolvedValue({ affected: 1 });
      expect(tagRepository.delete).not.toHaveBeenCalled();

      await tagRepository.deleteTag(1);
      expect(tagRepository.delete).toHaveBeenCalled();
    });

    it('tagが無い場合は、errorを返す', async () => {
      tagRepository.delete.mockResolvedValue({ affected: 0 });

      expect(tagRepository.deleteTag(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTagsByRecipeId', () => {
    it('recipeIdが一致するtagを削除する', async () => {
      tagRepository.getTagsByRecipeId = jest.fn().mockResolvedValue(mockTags);
      tagRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
      expect(tagRepository.getTagsByRecipeId).not.toHaveBeenCalled();
      expect(tagRepository.delete).not.toHaveBeenCalled();

      await tagRepository.deleteTagsByRecipeId(1);
      expect(tagRepository.getTagsByRecipeId).toHaveBeenCalled();
      expect(tagRepository.delete).toHaveBeenCalled();
    });
  });
});
