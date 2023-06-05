import { HomeController } from "./home.controller";
import { HomeQuery } from "./queries/home.query";
import { CommandBus } from "@nestjs/cqrs";
import { QueryBus } from "@nestjs/cqrs";
import { HomeDto } from "./home.dto";
import { Test } from "@nestjs/testing";

describe("HomeController", () => {
    let homeController: HomeController;
    // let commandBus: CommandBus;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
          controllers: [HomeController],
          providers: [CommandBus, QueryBus],
        }).compile();
    
        homeController = moduleRef.get<HomeController>(HomeController);
        // commandBus = moduleRef.get<CommandBus>(CommandBus);
        queryBus = moduleRef.get<QueryBus>(QueryBus);
      });
    
    // describe("getHome", () => {
    //     it("should return undefined", async () => {
    //         expect(await homeController.getHome("1")).toEqual(undefined);
    //     });
    // });
    
    describe('getCampers', () => {
        it('should call queryBus.execute and return the result', async () => {
            const expectedResult: HomeDto[] = []; // Add your expected result here
            const executeSpy = jest
            .spyOn(queryBus, 'execute')
            .mockResolvedValue(expectedResult);

            const result = await homeController.getCampers();

            expect(executeSpy).toHaveBeenCalledWith(new HomeQuery());
            expect(result).toEqual(expectedResult);
        });
    });

});