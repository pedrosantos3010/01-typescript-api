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

        it("should return 400 when there is a validation error", async () => {
            const newUser = {
                email: "zezin@email.com",
                password: "1234",
            };

            const response = await global.testRequest
                .post("/users")
                .send(newUser);

            expect(response.status).toBe(422);
            expect(response.body).toEqual({
                code: 422,
                error: "User validation failed: name: Path `name` is required.",
            });
        });

        it("should return 409 when there is a validation error", async () => {
            const newUser = {
                name: "Zézinho",
                email: "zezin@email.com",
                password: "1234",
            };

            await global.testRequest.post("/users").send(newUser);
            const response = await global.testRequest
                .post("/users")
                .send(newUser);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({
                code: 409,
                error: "User validation failed: email: already exists in the database.",
            });
        });
    });
});
