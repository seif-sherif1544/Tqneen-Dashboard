// loginEndpoint: 'https://tqneen-prod-rlyoguxn5a-uc.a.run.app/api/admin/login',
import baseUrl from 'src/API/apiConfig'

export default {
  meEndpoint: '/auth/me',
  loginEndpoint: `${baseUrl}/api/admin/login`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'token',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

console.log()
