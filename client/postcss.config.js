module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-preset-env")({
      features: {
        "nesting-rules": false,
      },
    }),
  ],
};
