let fs = require('fs');
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

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
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: './',
        filename: 'js/bundle.js'
    },
    plugins: [
        definePlugin,
        new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ['dist']}),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        /* new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }), */
        // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' /* chunkName= */, filename: 'js/vendor.bundle.js' /* filename= */ }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                html5: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeComments: true,
                removeEmptyAttributes: true
            },
            hash: true
        }),
        new CopyWebpackPlugin([
            {from: 'assets', to: 'assets'}
        ])
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
    },
    optimization: {
        // splitChunks: {
        //     chunks: 'all'
        // },
        minimize: true
    }
};
