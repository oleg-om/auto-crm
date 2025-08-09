module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '22',
          browsers: '> 0.25%, not dead'
        },
        loose: true
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],

  plugins: [
    'babel-plugin-emotion',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'babel-plugin-css-modules-transform',
      {
        extensions: ['.styl', '.css', '.scss']
      }
    ]
  ]
}
