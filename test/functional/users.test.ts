import { User } from "@src/model/user";

describe("Users functional tests", () => {
    beforeEach(async () => {
        await User.deleteMany();
    });
    describe("When creating a new user", () => {
        it("should successfully create a new user", async () => {
            const newUser = {
                name: "Zézinho",
                email: "zezin@email.com",
                password: "1234",
            };

            const response = await global.testRequest
                .post("/users")
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newUser);
        });
    });
});
