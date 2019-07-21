module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://raspberrypi/api/",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  outputDir: "server/public",
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/"
};
