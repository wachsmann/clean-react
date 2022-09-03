import { SetStorageMock } from '@/data/test'
import faker from '@faker-js/faker'
import { LocalSaveAccessToken } from './local-save-access-token'
type SutTypes = {
  sut: LocalSaveAccessToken,
  setStorageSpy: SetStorageMock
}
const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageMock()
  const sut = new LocalSaveAccessToken(setStorageSpy)
  return { setStorageSpy, sut }
}
describe('LocaSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageSpy } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })
})