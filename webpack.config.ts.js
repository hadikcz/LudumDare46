let fs = require('fs');
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

let definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    WEBGL_RENDERER: true,
    CANVAS_RENDERER: true,
    VERSION: JSON.stringify(require('./package.json').version)
});

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'src/main.ts')
        ],
        vendor: ['phaser']
    },
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        library: '[name]',
        libraryTarget: 'umd',
        filename: '[name].js'
    },
    devtool: 'cheap-source-map',
    watch: true,
    plugins: [
        definePlugin,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './dist']
            }
        })
    ],
    resolve: {
        modules: [
            path.resolve('./src/'),
            path.resolve('./node_modules/')
        ],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    module: {
        rules: [
            { test: /\.(ts|tsx)$/, loader: 'ts-loader' },
            { test: /phaser\.js$/, loader: 'expose-loader?Phaser', include: [path.join(__dirname, 'src')] },
            { test: /\.(js|jsx)$/, use: ['babel-loader'], include: [path.join(__dirname, 'src')] }
        ]
    }
};
