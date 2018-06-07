const path = require('path');

module.exports = {
    name: 'musix',
    entry: {
        'bundle': './src/index.ts',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },

        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9999,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
};
