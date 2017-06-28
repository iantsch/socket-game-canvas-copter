const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
    const config = {
        entry: {
            controller: ['./src/js/controller/index.js', './src/sass/controller.scss'],
            screen: ['./src/js/screen/index.js', './src/sass/screen.scss'],
        },
        output: {
            filename: 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [{
                test: /qrcodejs/,
                use: 'exports-loader?QRCode=QRCode'
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                },
                exclude: [/underscore/, /qrcodejs/]
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            outputStyle: 'compressed'
                        }
                    },{
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            outputStyle: 'compressed'
                        }
                    }]
                })
            }]
        },
        resolve: {
            extensions: ['.js', '.json'],
            modules: [
                path.resolve(__dirname, 'src/js'),
                'node_modules'
            ],
            alias: {
                qrcodejs: 'qrcodejs/qrcode'
            }
        },
        plugins: [
            new ExtractTextPlugin({
                filename: 'css/[name].css',
                allChunks: true
            })
        ],
        devtool: 'source-map',
        target: 'web',
        watchOptions: {
            ignored: [/node_modules/]
        }
    };
    if (env && env.production) {
        config.plugins.push(
            new UglifyJSPlugin()
        );
    }
    return config;
};
