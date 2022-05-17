import { AxiosHttpClient } from './axios-http-client'
import axios from 'axios'
import faker from '@faker-js/faker'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
describe('AxiosHttpClient', () => {
  test('Should call Axios with correct URL', async () => {
    const sut = new AxiosHttpClient()
    const url = faker.internet.url()
    await sut.post({
      url,
      body: undefined
    })
    expect(mockedAxios).toHaveBeenCalledWith(url)
  })
})
