import { Config } from "@remotion/cli/config";
import path from "path";

Config.setEntryPoint("./src/remotion/index.ts");
Config.setPublicDir("./public");
Config.setChromiumDisableWebSecurity(true);
Config.setDelayRenderTimeoutInMilliseconds(180000);

Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias || {}),
        "@": path.resolve(process.cwd(), "src"),
      },
    },
  };
});
