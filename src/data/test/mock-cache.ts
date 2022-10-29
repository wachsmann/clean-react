import { SetStorage } from '../protocols/http'

export class SetStorageMock implements SetStorage {
  key: String
  value: any
  async set (key: String, value: any): Promise<void> {
    this.key = key
    this.value = value
  }
}
