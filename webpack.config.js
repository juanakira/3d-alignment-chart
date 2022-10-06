const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ruleForStyles = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
    // if your css links to images e.g. in backgrounds
    // use: ['style-loader', 'css-loader']
}
const rules = [ruleForStyles]
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin( {template: 'src/index.html'})
  ],
  module: {rules}
};