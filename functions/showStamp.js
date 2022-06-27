const functions = require('firebase-functions')
const admin = require('firebase-admin')
const database = admin.firestore()

const appDomain = process.env.APP_DOMAIN
const appName = process.env.APP_NAME

const func = functions.https.onRequest((req, res) => {
  const [, , stampId] = req.path.split('/')

  return database
    .collection('stamps')
    .where('id', '==', stampId)
    .limit(1)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0]
        const stampObj = doc.data()
        const html = createHtml(
          stampObj.id,
          stampObj.image_url,
          stampObj.description
        )
        res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.status(200).end(html)
      } else {
        // デフォルトのHTMLを返す
      }
    })
    .catch((err) => {
      console.warn(err)
      // 略 : エラー時はデフォルトのhtml（固定のOGP）を返す
    })
})

const createHtml = (stampId, imageUrl, description) => {
  const siteUrl = `https://${appDomain}`
  const pageUrl = `${siteUrl}/stamps/${stampId}`
  const title = `${stampId}`
  const siteName = appName
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <title>${title}</title>
        <meta property="og:title" content="${title}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:image:width" content="${process.env.OGP_IMG_WIDTH}">
        <meta property="og:image:height" content="${process.env.OGP_IMG_HEIGHT}">
        <meta property="og:description" content="${description}">
        <meta property="og:url" content="${pageUrl}">
        <meta property="og:type" content="article">
        <meta property="og:site_name" content="${siteName}">
        <meta name="twitter:site" content="${siteUrl}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${title}">
        <meta name="twitter:image" content="${imageUrl}">
        <meta name="twitter:description" content="${description}">
      </head>
      <body>
        <script type="text/javascript">window.location="/stamps/${stampId}";</script>
      </body>
    </html>
    `
}

module.exports = func
