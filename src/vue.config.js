module.exports = {
    devServer: {
      proxy: {
        '/consommateurs': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          pathRewrite: { '^/consommateurs': '' },
        },
      },
    },
  };
  