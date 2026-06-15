export function ensureBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.Alsafa_READ_WRITE_TOKEN) {
    process.env.BLOB_READ_WRITE_TOKEN = process.env.Alsafa_READ_WRITE_TOKEN
  }
}
