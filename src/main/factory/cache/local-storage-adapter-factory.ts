import { SetStorage } from '@/data/protocols/http'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
export const makeLocalStorageAdapter = (): SetStorage => new LocalStorageAdapter()
