import { InternalError } from "@src/util/errors/InternalError";
import config, { IConfig } from "config";
import * as HTTPUtil from "@src/util/Request";

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      "Unexpected error when trying to communicate to StormGlass";
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      "Unexpected error returned by the StormGlass service";
    super(`${internalMessage}: ${message}`);
  }
}

const stormGlassResourceConfig: IConfig = config.get(
  "App.resources.StormGlass"
);

export class StormGlass {
  public readonly stormGlassAPIParams =
    "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed";
  public readonly stormGlassAPISource = "noaa";

  public constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(
    latitude: number,
    longitude: number
  ): Promise<ForecastPoint[]> {
    try {
      const apiUrl = stormGlassResourceConfig.get("apiUrl");
      const response = await this.request.get<StormGlassForecastResponse>(
        `${apiUrl}/weather/point?lat=${latitude}&lng=${longitude}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get("apiToken"),
          },
        }
      );

      return this.normalizeResponse(response.data);
    } catch (err) {
      const error = err as HTTPUtil.RequestError;

      if (HTTPUtil.Request.isRequestError(error)) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(error.response?.data)} Code: ${
            error.response?.status
          }`
        );
      }

      throw new ClientRequestError((err as Error).message);
    }
  }

  private normalizeResponse(
    point: StormGlassForecastResponse
  ): ForecastPoint[] {
    return point.hours
      .filter((p) => this.isValidPoint(p))
      .map((p) => ({
        time: p.time,
        waveDirection: p.waveDirection[this.stormGlassAPISource],
        waveHeight: p.waveHeight[this.stormGlassAPISource],
        swellDirection: p.swellDirection[this.stormGlassAPISource],
        swellHeight: p.swellHeight[this.stormGlassAPISource],
        swellPeriod: p.swellPeriod[this.stormGlassAPISource],
        windDirection: p.windDirection[this.stormGlassAPISource],
        windSpeed: p.windSpeed[this.stormGlassAPISource],
      }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}

export interface StormGlassPointSource {
  noaa: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveDirection: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveDirection: number;
  waveHeight: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}
