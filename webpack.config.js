const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, _) => {
    const isProduction = env && env.production ? env.production : false;
    const srcFolder = path.join(isProduction ? "es5" : "src");
    const entryPath = path.join(__dirname, srcFolder);
    const outputFile = "bundle.js";
    const mainScript = "index.js";
    const cesiumSource = "node_modules/cesium/Source";
    const hasuraDomain = process.env.COVID_HASURA_DOMAIN;
    const ionToken = process.env.COVID_ION_TOKEN;
    const mapboxToken = process.env.COVID_MAPBOX_TOKEN;

    const plugins = [
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify("/dist"),
            GRAPHQL_ENDPOINT: JSON.stringify(`https://${hasuraDomain}/v1/graphql`),
            ION_TOKEN: JSON.stringify(ionToken),
            MAPBOX_TOKEN: JSON.stringify(mapboxToken),
            STAGING_ENV: JSON.stringify(isProduction ? 'prod' : 'dev'),
        }),
        new CopyPlugin([
            {
                from: path.join(cesiumSource, "Workers"),
                to: "Workers",
            },
            {
                from: path.join(cesiumSource, "Assets"),
                to: "Assets",
            },
            {
                from: path.join(cesiumSource, "Widgets"),
                to: "Widgets",
            },
        ]),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ];

    const loaders = [
        {
            test: /\.(s*)css$/,
            use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
            test: /\.(png|gif|jpg|jpeg|xml|svg|woff|woff2|eot|ttf)$/,
            use: ["url-loader"],
        }
    ];

    if (!isProduction) {
        loaders.push({
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env",
                        "@babel/preset-react"
                    ],
                    plugins: [
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            }
        });
    }

    return {
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? false : "source-map",
        output: {
            path: path.join(__dirname, "wwwroot", "dist"),
            filename: outputFile,
            publicPath: "wwwroot/dist/",
            sourcePrefix : ""
        },
        entry: path.join(entryPath, mainScript),
        module: {
            rules: loaders,
            unknownContextCritical: false
        },
        plugins: plugins,
        performance: {hints: false},
        watchOptions: {},
        resolve: {
            alias: {
                cesium$: "cesium/Cesium",
                cesium: "cesium/Source",
            },
        }
    };
};
