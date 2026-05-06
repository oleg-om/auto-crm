module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: '> 0.25%, not dead'
        }
        // No `loose: true` — must match class-properties / private-methods / private-property-in-object.
      }
    ],
    '@babel/react',
    '@babel/typescript'
  ],

  plugins: (process.env.NODE_ENV === 'development' ? ['react-refresh/babel'] : []).concat([
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
