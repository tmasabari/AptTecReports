const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
            './src/containers/Integration/AptTecIntegration.js' ],

        // Entry point for designer
        designer: [
            './src/containers/Designer/Designer.js'],
            //'./src/components/3rdParty/html2canvas.min.js'],

        // Entry point for preview content
        previewContent: [
            './src/containers/Layout/Layout.js'
        ],
    } ,

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
        path: path.resolve(__dirname,  'dist'),
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
            //css minifier
            {
                //The test line tells webpack where to look for files that match a certain file type
                test: /.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: "css-loader", options: { sourceMap: true } },
                    //{ loader: "sass-loader", options: { sourceMap: true } },
                ],
            },

            //html minifier
            {
                test: /\.html$/i,
                type: "asset/resource",
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

            // For `html-minifier-terser`:
            //
            new HtmlMinimizerPlugin({
                parallel: true,
                minimizerOptions: {
                    collapseWhitespace: true,
                    removeComments:true,
                    //do not minify css within the html which breaks templated css styles.
                    minifyCSS:false,
                    minifyJS:true
                }
            }),
            
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                //{ from: "source", to: "dest" },
                {
                    context: path.resolve(__dirname, "src", "components","3rdParty"),
                    from: "./*.js",
                },
                {
                    context: path.resolve(__dirname, "src", "containers"),
                    from: "./**/*.html",
                },
                {
                    context: path.resolve(__dirname, "Utils"),
                    from: "./*.html",
                },
                {
                    context: path.resolve(__dirname, "src", "Schema"),
                    from: "./*.json",
                },
            ]
        }),
    ],
};