import { StormGlass } from "@src/clients/StormGlass";
import stormGlassWeather3HoursFixture from "@test/fixtures/stormGlass_weather_3_hours.json";
import stormGlassNormalizedResponse3Hours from "@test/fixtures/stormGlass_normalized_response_3_hours.json";
import * as HTTPUtil from "@src/util/Request";

jest.mock("@src/util/Request");

describe("StormGlass client", () => {
  const mockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalizedResponse3Hours);
  });

  it("should exclude incomplete data points", async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: "2020-04-26T00:00:00+00:00",
        },
      ],
    };
    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.Response);
    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it("should get a generic error from StormGlass service when the request fail before reaching the service", async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: "Network Error" });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });

  it("should get an StormGlassResponseError when the StormGlass service responds with error", async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      },
    });
    mockedRequestClass.isRequestError.mockReturnValue(true);

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
