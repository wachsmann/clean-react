import { SetStorage } from '@/data/protocols/http'

export class LocalStorageAdapter implements SetStorage {
  async set (key: string, value: any): Promise<void> {
    localStorage.setItem(key,value)
  }
}
