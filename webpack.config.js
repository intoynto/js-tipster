const path=require("path");
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dev=require("./wp.dev");

module.exports=function(env,args)
{
    const isProd=args && args.mode && args.mode==="production"?true:false;
    const mode=isProd?"production":"development";
    console.log("wp.mode ",mode," env ",env);

    const conf=
    {        
        output:{
            path:path.resolve(__dirname,"dist"),
            chunkFilename: '[name].js',
            filename: '[name].js',
            libraryTarget: 'umd',
            library: `${dev.MODUL_NAME}`,
            umdNamedDefine: true
        },
        devtool:'source-map',
        resolve: { 
            extensions: [".ts",".tsx",".js",".jsx"],
            alias:{
                "react": "preact/compat",
                "react-dom": "preact/compat"
            } 
        },
        externals:{
            "react":"react",
            "react-dom":"react-dom"
        },
        plugins:[
            new CleanWebpackPlugin(),                     
            new TypescriptDeclarationPlugin({
                out:`${dev.MODUL_NAME}.d.ts`,
            })
        ],
        //stats:"detailed",
        module:{
            rules: [
                {
                    test: /\.(ts|tsx|js)$/,
                    exclude: /(node_module|dist)/,
                    use:[
                        {
                            loader: 'babel-loader',
                            options: {
                                presets:[
                                    "@babel/preset-env",
                                    "@babel/preset-react",
                                ],
                                cacheDirectory: true,
                            },
                        },
                        {
                            loader: 'ts-loader',
                        },                        
                    ],
                }
            ]
        },
        optimization:{
            minimizer:[
                new TerserWebpackPlugin()
            ],
        }
    };

    conf.entry={};
    conf.entry[`${dev.MODUL_NAME}`]=path.resolve(__dirname,"src/index.tsx");
    return conf;
}