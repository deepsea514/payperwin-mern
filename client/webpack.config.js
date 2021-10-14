const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const config = require('../config.json');

const TARGET = process.env.npm_lifecycle_event;

const common = {
    entry: [
        '@babel/polyfill',
        './src/index.jsx',
        "./src/PPWAdmin/index.scss",
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
                test: /\.css$/,
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
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        }
                    },
                ]
            },
        ],
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.scss'],
    },
    devtool: 'none',
    target: 'web',
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename: "[name].css",
        // }),
    ],
};

if (TARGET === 'start') {
    module.exports = merge(common, {
        mode: 'development',
        devServer: {
            historyApiFallback: true,
            contentBase: [
                path.join(__dirname, 'public'),
                path.join(__dirname, 'serve')
            ],
            port: config.clientPort,
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
