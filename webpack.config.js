var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: './src',
        editor: './src/editor.js'
    },
    output: {
        path: 'builds',
        filename: '[name].bundle.js',
        chunkFilename: '[id].js',
        publicPath: 'builds/'
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel',
                include: __dirname + '/src',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.scss/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            },
            {
                test: /\.html/,
                loader: 'html'
            },
            {
                test: /\.png/,
                loader: 'url'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].bundle.css'),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};