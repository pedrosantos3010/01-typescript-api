import { CUSTOM_VALIDATION } from "@src/model/user";
import { Response } from "express";
import mongoose from "mongoose";

export abstract class BaseController {
    protected sendCreateUpdateErrorResponse(
        res: Response,
        error: mongoose.Error.ValidationError | Error
    ): void {
        if (error instanceof mongoose.Error.ValidationError) {
            const clientErrors = this.handlerClientErrors(error);
            res.status(clientErrors.code).send(clientErrors);
        } else {
            res.status(500).send({ code: 500, error: "Something went wrong!" });
        }
    }

    private handlerClientErrors(error: mongoose.Error.ValidationError): {
        code: number;
        error: string;
    } {
        const duplicatedKindError = Object.values(error.errors).filter(
            (error) =>
                (<mongoose.Error.ValidatorError>error).kind ===
                CUSTOM_VALIDATION.DUPLICATED
        );
        if (duplicatedKindError.length) {
            return { code: 409, error: error.message };
        }

        return { code: 422, error: error.message };
    }
}
