import { makeAxiosHttpClient } from '@/main/factory/http/axios-http-client-factory'
import { makeApiUrl } from '@/main/factory/http/api-url-factory'
import { AddAccount } from '@/domain/usecases/add-account'
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'
export const makeRemoteAddAccount = (): AddAccount => {
  return new RemoteAddAccount(makeApiUrl('/signup'), makeAxiosHttpClient())
}
