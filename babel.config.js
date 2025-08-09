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
    '@babel/react',
    '@babel/typescript'
  ],

  plugins: (process.env.NODE_ENV === 'development'
    ? ['react-hot-loader/babel']
    : []
  ).concat([
    'emotion',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'css-modules-transform',
      {
        extensions: ['.styl', '.css', '.scss']
      }
    ]
  ])
}
