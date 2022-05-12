import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default [
  // - CommonJS (for Node)
  // - ES module (for bundlers)
  // - UMD (for browser)
  {
    input: "src/index.ts",
    external: ["react","axios"],
    output: [
      // NOTE: interop: false is deprecated.
      // When we upgrade need to identify best path forward to avoid bloat.
      { file: pkg.main, format: "cjs", sourcemap: true, interop: false },
      { file: pkg.module, format: "es", sourcemap: true },
      {
        name: "react-file-hooks",
        file: pkg.unpkg,
        format: "umd",
        sourcemap: true,
        globals: {
          react: 'React',
          axios: 'Axios'
        },
        interop: false,
      }
    ],
    // ts definition outputs specified in config
    plugins: [typescript({ tsconfig: './tsconfig.json' })],
  },
];
