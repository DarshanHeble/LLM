import admin from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

const ser = process.env.creds
console.log(ser)

// const serviceAccount = creds
admin.initializeApp({
  credential: admin.credential.cert({
    type: 'service_account',
    project_id: 'llms-f9057',
    private_key_id: 'f9fbf45e9c5119f71151b1e0e16132a5401ad5fc',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCZm3oLqBVPWlx4\njggfVmV+1E4gynkjudqaF1FnPak1oMQBPKYcsqfz3fben6nnQovjP9rPsaIwMlum\nBMpG91qHElXfJ2iPizoRvYnoN/EjqtqEHF2MkJoq/w8TZcMC7apfrJ6CTRMtayI4\nAhR4ApB8/XXhX3lwNUeIOZ2RDnhq5Rtuh3w9Rzpq1hAC40MstwQEm8PeWGwIP8Mh\nlw5e7GVTJI1Crh84qS7OGmeRpbEj8ZN924K3n5eFZkhsCpgy7ggTmv92+OI312sl\nycQQ19k6wM9oOn2s2264PVwwdGl7FKlBgQogynziTmgXlcIQrFPYcNhzd8Q1Tgri\nUj0JRwcVAgMBAAECggEAAPXbpLyDi5g3SUqsCtQdtNYLegGCEeLc1sdMCz7zsqHj\nb9WK/VVxnuD1pO0vIQLFwKE60z8bUj1SXN6dTCXKQ1tuPYOvz+vxLEC43sKQx6YP\nETHjNNiHmjq3g6nIdxl4zfnUkOB9/PP1Rg/fRGPRtvJXvRW9euHeZV/k2A4U2yg6\nkYkpM0q0GojotKO7phP+gir7fUpv50OABl6B3SdIPW3WUMxQ4HtVaidT3UcwO/ev\nDq0DHa9InRswD5KfATcgjmm/6OvVpo3fz9yY7C9a3uf8PUclc/NgqBlcvRPqxElr\nGMZFhEKNCSVGGpaWzuwK1GeOiXs89cA5LHqEgEQzOQKBgQDJw/xzuxF/aKtxYSUz\nAuveVKKd/jv9JiqlI/i3H3aMhwxo2eEmfdDcrFNI93NbnKzr5xlbgNIXN3FNfCVM\n6hKybRiLlEnlomfKzkhg4HXJJX5QS+RtyCVI7YElx83O5RO6ovOHPwYwqw56XEqG\nMKyNM4eL0k4UP4lxKutJGqmN+QKBgQDC5ZjJb67YYUetcJR97bnpc7BDiaBLdUbD\nKwzvl3Y50TNSttCcY97KGJE4xtW0PXCvfHl/VwqK1pfw7yhAnAZuJcWR7Ib01/Vp\nNurzzabotypaFbD6bzRIyzEla9VnEjesHe6jMbH+nxSp37jyJSEzOz1eGWpjRreu\n/RnObLF4/QKBgBs71wGQCIaYDDwbjrfZ9xhleCW3QUWkNzFfL50YJBpHyEcG0bsu\nVFjU8dDxhaKh/T1CTkvpkXIMy8BXt3kwRyHKU/vTIj5as4POYDqjUYK7Ctevxr+C\nunWjiUEePQtmJEmW4SQqP52mGSgu+Ogv/bp5cBxRYLSe9uBNmMCfVq+RAoGAODh0\n936hCEgfnheArkbaP06hBQp5U+sTq48Knz6o2wrO7EhSKxrgFJo7og4xbVnf3K9i\neOpJ3z0B/X1vthuL+1AoCu0ZDR4S6/PsmMG1KSJVNEFXmRZlFa6PkcTmfWIS7zJ/\nOVJHjzSiiFJCDo/JYPbwv+lC+DpZGEBoplRSaZ0CgYARywVB85YFBxxHmI7IX6/0\nZIZNfH5kC7y5kDmtihqA1RVCEHJPsthrJugaIaksk4v7S9XN4VGMadvSH7de3TgY\nAP6bli2kEevhzv5JuBTNWT+e4mSgkuzcOKXdmKy2akRUZW2VO592PYiROwumya4t\nDz3bbgDehDkaiDxenUFaFg==\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-ih36f@llms-f9057.iam.gserviceaccount.com',
    client_id: '116453951816715397338',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ih36f%40llms-f9057.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
  })
})

const db = admin.firestore()
export default db
