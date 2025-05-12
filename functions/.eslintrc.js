module.exports = {
  extends: ["../.eslintrc.cjs"], // extend the light-T100 configuration
  env: {
    node: true,
  },
  ignorePatterns: [
    "!**/*", // ignore all files except those in the functions directory
    "lib",
    ".eslintrc.cjs",
    "node_modules",
  ],
  parserOptions: {
    sourceType: "module",
  },
  rules: {
    // override any rules here
  },
};
