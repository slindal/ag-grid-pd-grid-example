import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.js';
import express from 'express';

const app = express();
app.use(webpackMiddleware(webpack(webpackConfig)));

app.listen(4000, () => {
  console.log('Started on localhost:4000');
});
