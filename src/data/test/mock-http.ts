import faker from '@faker-js/faker'
import { HttpPostParams } from '@/data/protocols/http/http-post-client'

export const mockPostRequest = (): HttpPostParams<any> => (
  {
    url: faker.internet.url(),
    body: faker.helpers.objectValue({ mockPostKey: 'mockPostValue' })
  }
)
