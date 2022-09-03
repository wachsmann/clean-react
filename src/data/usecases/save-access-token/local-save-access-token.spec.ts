import { SetStorageMock } from '@/data/test'
import faker from '@faker-js/faker'
import { LocalSaveAccessToken } from './local-save-access-token'
type SutTypes = {
  sut: LocalSaveAccessToken,
  setStorageMock: SetStorageMock
}
const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalSaveAccessToken(setStorageMock)
  return { setStorageMock, sut }
}
describe('LocaSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageMock } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageMock.key).toBe('accessToken')
    expect(setStorageMock.value).toBe(accessToken)
  })
  test('Should throw if SetStorage throws ', async () => {
    const { sut, setStorageMock } = makeSut()
    jest.spyOn(setStorageMock,'set').mockRejectedValueOnce(new Error())
    const promise = sut.save(faker.datatype.uuid())
    expect(promise).rejects.toThrow(new Error())
  })
})