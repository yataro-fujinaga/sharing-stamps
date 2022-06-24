const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.database()

const CONFIG = functions.config()
const appDomain = CONFIG.app.domain
const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630

const func = functions.https.onRequest((req, res) => {
  const [, , stampId] = req.path.split('/')
  return db
    .ref('/stamps')
    .doc(stampId)
    .get()
    .then((snap) => {
      if (!snap) {
        res.status(404).end('404 Not Found')
        return
      }
      const stockItem = snap ? snap.data() : {}
      const uname = stockItem.uname || ''
      const html = createHtml(uname, stampId)
      res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
      res.status(200).end(html)
    })
    .catch((err) => {
      console.warn(err)
      // 略 : エラー時はデフォルトのhtml（固定のOGP）を返す
    })
})

const createHtml = (uname, stockid) => {
  const SITEURL = `https://${appDomain}`
  const PAGEURL = `${SITEURL}/stock/${stockid}`
  const TITLE = `view ${escapeHtml(uname)}'s colorsets on colorinco`
  const DESCRIPTION =
    'カラーインコはTwitterでお気に入りしている画像のカラーパレットを表示・ストックできるサービスです。'
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>colorinco</title>
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${SITEURL}/ogp/stockimg/${stockid}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="colorinco*カラーインコ">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${SITEURL}/ogp/stockimg/${stockid}">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
    <script type="text/javascript">window.location="/_stock/${stockid}";</script>
  </body>
</html>
`
}

module.exports = func
