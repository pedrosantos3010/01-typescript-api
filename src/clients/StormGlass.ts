import { AxiosStatic } from "axios";

export class StormGlass {
  public readonly stormGlassAPIParams =
    "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed";
  public readonly stormGlassAPISource = "noaa";

  public constructor(protected request: AxiosStatic) {}

  public async fetchPoints(
    latitude: number,
    longitude: number
  ): Promise<ForecastPoint[]> {
    const url = `https://api.stormglass.io/v2/weather/point`;

    const response = await this.request.get<StormGlassForecastResponse>(
      `${url}?lat=${latitude}&lng=${longitude}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=1592113802`,
      {
        headers: {
          Authorization: "fake-token",
        },
      }
    );

    return this.normalizeResponse(response.data);
  }

  private normalizeResponse(
    point: StormGlassForecastResponse
  ): ForecastPoint[] {
    return point.hours.filter(this.isValidPoint.bind(this)).map((p) => ({
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
