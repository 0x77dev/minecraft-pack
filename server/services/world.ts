import { EventEmitter } from "events";
import { Bucket, Storage } from "@google-cloud/storage"

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
    
    for (const file of files) {
      console.log(file.name)
    }
  }
}