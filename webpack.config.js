const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'development',
    optimization: {
        minimize: false,
        namedChunks: true,
        namedModules: true,
    },
    devtool: "none",
    entry: {
        // app: './src/test.js'
        // app:['babel-polyfill', './src/app.js']
        app: './src/app.js'
        // app: './src/main.js'
        // app: './src/redux/store.js'
    },
    output: {
        // path: path.resolve(__dirname,'build'),
        // filename: 'app.js',
        filename: 'test.js',
        // libraryTarget: 'umd',
        // library: 'Order',
        // umdNamedDefine: true
    },
    module:{
        rules:[
            // {
            //     test: /\.html$/,
            //     exclude: /node_modules/,
            //     use: {loader: 'html-loader'}
            // },
            {
                test: /\.html$/,
                use: 'raw-loader',
            },
            // {
            //     test: /\.js?$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ["@babel/preset-env"]
            //         }
            //     }
            // },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
            {
                test: /\.scss$/i,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
            ,
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {}
                }
            }
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin()
    ]
}