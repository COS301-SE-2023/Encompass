import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { SearchController } from './search.controller';
import { GetAllItemsByKeywordQuery } from './queries/get-all-items-by-keyword.query';
import { PostDto } from '@encompass/api/post/data-access';

describe('SearchController', () => {
  let controller: SearchController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('getAllItemsByKeyword', () => {
    it('should return an array of PostDto', async () => {
      const keyword = 'test';
      const expectedPosts: PostDto[] = [
        {
            _id: '1',
            community: 'test',
            title: 'test',
            text: 'test',
            username: 'test',
            imageUrl: 'test',
            communityImageUrl: 'test',
            categories: ['test'],
            likes: ['test'],
            dislikes: ['test'],
            dateAdded: new Date(),
            spoiler: true,
            ageRestricted: true,
            shares: 1,
            comments: 1,
            reported: true,
            isPrivate: true,
        },
        {
            _id: '2',
            community: 'test',
            title: 'test',
            text: 'test',
            username: 'test',
            imageUrl: 'test',
            communityImageUrl: 'test',
            categories: ['test'],
            likes: ['test'],
            dislikes: ['test'],
            dateAdded: new Date(),
            spoiler: true,
            ageRestricted: true,
            shares: 1,
            comments: 1,
            reported: true,
            isPrivate: true,
        },
      ];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedPosts);

      const result = await controller.getAllItemsByKeyword(keyword);

      expect(result).toEqual(expectedPosts);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetAllItemsByKeywordQuery(keyword),
      );
    });
  });
});