import { Test, TestingModule } from '@nestjs/testing';
import { MediaRecommenderController } from './media-recommender.controller';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetRecommendedBooksQuery } from './queries/get-all-books/getRecommendedBooks.query';
import { GetRecommendedMoviesQuery } from './queries/get-recommended-movies/getRecommendedMovies.query';
import { GetAllMoviesQuery } from './queries/get-all-movies/getAllMovies.query';
import { GetRecommendedPodcastsQuery } from './queries/get-recommended-podcasts/getRecommendedPodcasts.query';

describe('MediaRecommenderController', () => {
  let controller: MediaRecommenderController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaRecommenderController],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MediaRecommenderController>(
      MediaRecommenderController,
    );
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRecommendedBooks', () => {
    it('should return an array of BookDto', async () => {
      const id = '1';
      const expectedResult = [{ id: '1', title: 'Book 1' }];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.getRecommendedBooks(id);

      expect(result).toEqual(expectedResult);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetRecommendedBooksQuery(id),
      );
    });
  });

  describe('getRecommendedMovies', () => {
    it('should return an array of MovieDto', async () => {
      const id = '1';
      const expectedResult = [{ id: '1', title: 'Movie 1' }];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.getRecommendedMovies(id);

      expect(result).toEqual(expectedResult);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetRecommendedMoviesQuery(id),
      );
    });
  });

  describe('getAllMovies', () => {
    it('should return an array of MovieDto', async () => {
      const expectedResult = [{ id: '1', title: 'Movie 1' }];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.getAllMovies();

      expect(result).toEqual(expectedResult);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetAllMoviesQuery());
    });
  });

  describe('getRecommendedPodcasts', () => {
    it('should return an array of PodcastDto', async () => {
      const id = '1';
      const expectedResult = [{ id: '1', title: 'Podcast 1' }];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.getRecommendedPodcasts(id);

      expect(result).toEqual(expectedResult);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetRecommendedPodcastsQuery(id),
      );
    });
  });
});