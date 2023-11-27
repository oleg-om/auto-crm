const Html = ({ body }) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" type="text/css" href="/css/main.css" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Autodom CRM</title>
      <link rel="icon" href="/images/icon.png" />
      <meta name="robots" content="noindex" />
    </head>
    <body>
      <div id="root">${body}</div>
      <script type="text/javascript" src="/js/main.bundle.js?v=COMMITHASH"></script>
    </body>
  </html>
`
}

export default Html
