import { exec } from "child_process"
import { writeFileSync } from "fs"

export const authorizeStorage = () => {
  return new Promise((res, rej) => {
    writeFileSync('/tmp/key.json', Buffer.from(process.env.GOOGLE_KEY as string, "base64"))
    exec("gcloud auth activate-service-account server@minecraft-pack.iam.gserviceaccount.com --key-file=/tmp/key.json --project=minecraft-pack", (err, stdout) => {
      if (err) { rej(err); return }
      console.log(stdout)
      res(stdout)
    })
  })
}

export const upload = () => {
  const bucketName = process.env.GCS_BUCKET_NAME as string

  return new Promise((res, rej) => {
    exec(`gsutil -m cp -r /data/world "gs://${bucketName}"`, (err, stdout) => {
      if (err) { rej(err); return }
      console.log(stdout)
      res(stdout)
    })
  })
}

export const download = () => {
  const bucketName = process.env.GCS_BUCKET_NAME as string

  return new Promise((res, rej) => {
    exec(`gsutil -m cp -r "gs://${bucketName}" /data/world`, (err, stdout) => {
      if (err) { rej(err); return }
      console.log(stdout)
      res(stdout)
    })
  })
}