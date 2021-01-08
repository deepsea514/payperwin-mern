const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const TARGET = process.env.npm_lifecycle_event;

const common = {
  entry: [
    '@babel/polyfill',
    './src/index.jsx',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.js$|.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        // options: {
        //   presets: ['react', 'env', 'stage-1'],
        // },
      },
      {
        test: /\.css$|.scss$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'public/style/fonts/',
          },
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx'],
  },
  devtool: 'none',
  target: 'web',
  plugins: [
    // new BundleAnalyzerPlugin(),
  ],
};

if (TARGET === 'start') {
  module.exports = merge(common, {
    mode: 'development',
    devServer: {
      historyApiFallback: true,
      contentBase: './public',
      port: 8082,
      disableHostCheck: true,
      stats: {
        colors: true,
        maxModules: 0,
        source: false,
        modulesSort: 'size',
      },
    },
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    mode: 'production',
  });
}
