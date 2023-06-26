import { HomeController } from "./home.controller";
import { HomeQuery } from "./queries/home.query";
import { CommandBus } from "@nestjs/cqrs";
import { QueryBus } from "@nestjs/cqrs";
import { HomeDto } from "./home.dto";
import { Test } from "@nestjs/testing";
import { ObjectId } from "mongoose";

describe("HomeController", () => {
  let controller: HomeController;
  let mockQueryBus: { execute: jest.Mock };
  let mockCommandBus: { execute: jest.Mock };
  const genericHome = {
      _id: null,
      name: null
  };
  beforeAll(async () => {
      mockCommandBus = { execute: jest.fn() };
      mockQueryBus = { execute: jest.fn() };
      const module = await Test.createTestingModule({
          controllers: [HomeController],
          providers: [ { provide: QueryBus, useValue: mockQueryBus }, { provide: CommandBus, useValue: mockCommandBus }],
      }).compile();
  
      controller = module.get<HomeController>(HomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCampers', () => {
    it('should take no argument and return a HomeDto onject', async () => {
        mockQueryBus.execute.mockReturnValue(genericHome);
        const returnedHome = await controller.getCampers();
        expect(returnedHome).toEqual(genericHome);
    });
  });
});