import { Home } from "./home";

describe("Home", () => {
    it("should create an instance", () => {
        expect(new Home("11","Morgan test")).toBeTruthy();
    });

    it("should return the id 11", () => {
        const home = new Home("11","Morgan test");
        expect(home.getId()).toEqual("11");
    });

    it("should return undefined if id is not set", () => {
        const home = new Home(undefined,"Morgan test");
        expect(home.getId()).toEqual(undefined);
    });

    it("should return the name Morgan test", () => {
        const home = new Home("11","Morgan test");
        expect(home.getName()).toEqual("Morgan test");
    });

    it("should return undefined if name is not set", () => {
        const home = new Home("11",undefined);
        expect(home.getName()).toEqual(undefined);
    });
});