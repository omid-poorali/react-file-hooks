import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  roots: ["./src", "./tests"],
  preset: "ts-jest",
  testEnvironment: "jsdom"
};


export default config;