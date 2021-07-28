module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js'
  },
  resolve: { 
    alias: { 
        "react": "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
        // Must be below test-utils
    },
  },
  module: {
    rules: [
      {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
              loader: 'babel-loader',
              options: {
                  presets: [
                      [
                          "@babel/env",
                          {
                              "targets": {
                                  "ie": "11",
                                  "firefox": "60",
                                  "chrome": "67",
                                  "safari": "11.1",
                              }
                          }
                      ]
                  ],
                  plugins: [
                      ["transform-es2017-object-entries"],
                      ["@babel/plugin-transform-react-jsx"],
                      ['@babel/transform-runtime']
                  ]
              }
          }
      },
      {
        test: /\.(sass|less|css)$/,
        loaders: ['style-loader', 'css-loader']
      }
  ]
  }
};