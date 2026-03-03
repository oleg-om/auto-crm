module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: '> 0.25%, not dead'
        }
      }
    ],
    '@babel/react',
    '@babel/typescript'
  ],

  plugins: (process.env.NODE_ENV === 'development'
    ? ['react-refresh/babel']
    : []
  ).concat([
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-export-default-from',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    ['@babel/plugin-transform-private-methods', { loose: false }],
    ['@babel/plugin-transform-private-property-in-object', { loose: false }],
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
