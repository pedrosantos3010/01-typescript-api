import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import { User } from "@src/model/user";
import { BaseController } from ".";

@Controller("users")
export class UserController extends BaseController {
    @Post("")
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const user = new User(req.body);
            const newUser = await user.save();
            res.status(201).send(newUser);
        } catch (e) {
            this.sendCreateUpdateErrorResponse(res, <Error>e);
        }
    }
}
