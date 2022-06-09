import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (url: any): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...collectionWhitoutId } = collection
    return Object.assign({}, collectionWhitoutId, { id: _id.toString() })
  }
}
