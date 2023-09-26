import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommunityLeaderboardController } from "./community-leaderboard.controller";
import { CommunityLeaderboardDto } from "./community-leaderboard.dto";
import { Test } from "@nestjs/testing";

describe('community-leaderboard.controller', () => {
    let controller: CommunityLeaderboardController;
    let mockCommandBus: { execute: jest.Mock };
    let mockQueryBus: { execute: jest.Mock };
    const genericCommunityLeaderboard: CommunityLeaderboardDto = {
        _id: 'testID',
        name: 'testName',
        communityEP: 0,
        position: 0,
    }

    beforeAll(async () => {
        mockCommandBus = { execute: jest.fn() };
        mockQueryBus = { execute: jest.fn() };
        
        const module = await Test.createTestingModule({
            controllers: [CommunityLeaderboardController],
            providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
        }).compile();
    
        controller = module.get<CommunityLeaderboardController>(CommunityLeaderboardController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getLeaderboard', () => {
        it('should call the CommunityLeaderboard controller', async () => {
            const getLeaderboardSpy = jest.spyOn(controller, 'getLeaderboard');
            await controller.getLeaderboard();
            expect(getLeaderboardSpy).toBeCalled();
        });

        it('should return the CommunityLeaderboard', async () => {
            mockQueryBus.execute.mockReturnValue([genericCommunityLeaderboard]);
            const returnedCommunityLeaderboard = await controller.getLeaderboard();
            expect(returnedCommunityLeaderboard).toEqual([genericCommunityLeaderboard]);
        });
    });

    describe('setLeaderboard', () => {
        it('should call the CommunityLeaderboard controller', async () => {
            const setLeaderboardSpy = jest.spyOn(controller, 'setLeaderboard');
            await controller.setLeaderboard();
            expect(setLeaderboardSpy).toBeCalled();
        });

        it('should return the CommunityLeaderboard', async () => {
            mockCommandBus.execute.mockReturnValue([genericCommunityLeaderboard]);
            const returnedCommunityLeaderboard = await controller.setLeaderboard();
            expect(returnedCommunityLeaderboard).toEqual([genericCommunityLeaderboard]);
        });

    });
});