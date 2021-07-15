import { EventEmitter } from "events";
import { Bucket, Storage } from "@google-cloud/storage"
import { join } from "path"
import { readdirSync } from 'fs'
export class World extends EventEmitter {
  private bucket: Bucket

  constructor(
    private storage = new Storage({
      credentials: JSON.parse(Buffer.from(process.env.GOOGLE_KEY as string, "base64").toString())
    })
  ) {
    super()
    this.bucket = this.storage.bucket(process.env.GCS_BUCKET_NAME as string)
  }

  public async downloadWorld() {
    const [files] = await this.bucket.getFiles({
      prefix: 'world'
    })

    console.log("downloading", files)

    for (const file of files) {
      await file.download({
        destination: join('/data', file.name)
      })

      console.log(file.name)
    }
  }

  public async uploadWorld() {
    const files = readdirSync(join('/data', 'world'))

    for (const file of files) {
      await this.bucket.upload(file, { destination: join('world', file) })
    }
  }
}
