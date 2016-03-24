var webpack = require('webpack');

module.exports = {
    entry: './src',
    output: {
        path: 'builds',
        filename: 'bundle.js',
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
                loader: 'style!css!sass'
            },
            {
                test: /\.scss/,
                loader: 'style!css!sass'
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
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};