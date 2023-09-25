const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// Webpack uses this to work with directories
const path = require('path');

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = {

    // Path to your entry point. From this file Webpack will begin its work
    // if you split the existing file please clean the dist folder first 
    entry: {
        // Entry point for integration
        AptTecIntegration: [
            './Resources/Scripts/Integration/AptTecIntegration.js' ],
        // Entry point for designer
        designer: [
            './Resources/Scripts/Designer/designer.js',
            './Resources/Scripts/Designer/html2canvas.min.js'],
        // Entry point for preview content
        previewContent: [
            './Resources/Scripts/printContent/report.js',
            './Resources/Scripts/printContent/pagedjs-hooks.js',
            './Resources/Scripts/printContent/pagedjs-repeat-table-header.js'
        ],
        // not working as webpack removes the global variable assignments
        // pagedPolyfill: [
        //     './Resources/Scripts/printContent/paged.polyfill.js'
        // ]

    } ,

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        path: path.resolve(__dirname, 'dist'),
        //publicPath: '',
        //[name] is a placeholder that gets replaced with the entry point key (designer, previewContent, etc.) to generate dynamic filenames for the output bundles.
        filename: '[name].bundle.js'
    },

    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on the final bundle. For now, we don't need production's JavaScript
    // minifying and other things, so let's set mode to development
    // https://webpack.js.org/guides/production/
    mode: 'production',
    devtool: 'source-map',

    //Css minifier https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
    module: {
        rules: [
            {
                //The test line tells webpack where to look for files that match a certain file type
                test: /.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { sourceMap: true } },
                    //{ loader: "sass-loader", options: { sourceMap: true } },
                ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
            }),
        ],
    },
    plugins: [new MiniCssExtractPlugin()],
};