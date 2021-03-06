import "./util/module-alias";
import { Server } from "@overnightjs/core";
import express, { Application } from "express";
import { ForecastController } from "@src/controllers/forecast";
import * as database from "@src/database";
import { BeachesController } from "./controllers/beaches";
import { UserController } from "./controllers/users";

export class SetupServer extends Server {
    constructor(private port = 3000) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        this.setupControllers();
        await this.databaseSetup();
    }

    private setupExpress(): void {
        this.app.use(express.json());
        this.setupControllers();
    }

    private setupControllers(): void {
        const forecastController = new ForecastController();
        const beachesController = new BeachesController();
        const usersController = new UserController();
        this.addControllers([
            forecastController,
            beachesController,
            usersController,
        ]);
    }

    private async databaseSetup(): Promise<void> {
        await database.connect();
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public getApp(): Application {
        return this.app;
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.info("Server listening of port:", this.port);
        });
    }
}
