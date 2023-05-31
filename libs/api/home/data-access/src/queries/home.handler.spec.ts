//Homehandlertest
/*import { TextEncoder, TextDecoder } from "util";
import { HomeHandler } from './home.handler';
import { HomeDtoRepository } from '../db/home-dto.repository';
import { HomeDto } from '../home.dto';
import { Test } from '@nestjs/testing';

describe('HomeHandler', () => {
    let homeHandler: HomeHandler;
    let homeDtoRepository: HomeDtoRepository;
    
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
        providers: [
            HomeHandler,
            {
            provide: HomeDtoRepository,
            useValue: {
                findAll: jest.fn(),
            },
            },
        ],
        }).compile();
    
        homeHandler = moduleRef.get<HomeHandler>(HomeHandler);
        homeDtoRepository = moduleRef.get<HomeDtoRepository>(HomeDtoRepository);
    });
    
    describe('execute', () => {
        it('should call homeDtoRepository.findAll and return the result', async () => {
        const expectedResult: HomeDto[] = []; // Add your expected result here
        const findAllSpy = jest
            .spyOn(homeDtoRepository, 'findAll')
            .mockResolvedValue(expectedResult);
    
        const result = await homeHandler.execute();
    
        expect(findAllSpy).toHaveBeenCalledWith();
        expect(result).toEqual(expectedResult);
        });
    });
    });*/