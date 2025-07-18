const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Минимзация файлов css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Нужен для анализа, при финальной сборке проверить на память
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
// Очистка папок и кеша при каждой сборке
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

// Оптимизация
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    // Готовый продукт
    // mode: 'production',
    // Сборка для разработки
    mode: 'development',
    // Подключение map к сборке
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ca]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'main.bundle.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public'),
                    to: path.resolve(__dirname, 'dist'),
                    globOptions: {
                        ignore: ['**/index.html']
                    },
                    noErrorOnMissing: true // Не ругайся, если папка с файлами пуста
                }
            ]
        }),
        // Анализатор занятости места
        new BundleAnalyzerPlugin(),
        // Очистка перед каждой сборкой
        new CleanWebpackPlugin(),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
    },
};