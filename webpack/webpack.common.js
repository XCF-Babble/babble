const webpack = require("webpack");
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = '../src/';

module.exports = {
    entry: {
        'background/background': path.join(__dirname, srcDir + 'background/background.ts'),
        'content/inject': path.join(__dirname, srcDir + 'content/inject.ts'),
        'options/options': path.join(__dirname, srcDir + 'options/options.ts'),
        'popup/popup': path.join(__dirname, srcDir + 'popup/popup.ts'),
        'web_accessible_resources/decrypt': path.join(__dirname, srcDir + 'web_accessible_resources/decrypt.ts'),
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: "initial"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    watchOptions: {
      poll: true,
      ignored: [
        '/node_modules/',
        '**/.git'
      ]
    },
    plugins: [
        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CopyPlugin([
            { from: '.', to: '../' }
          ],
          {context: 'public' }
        ),
    ]
};
