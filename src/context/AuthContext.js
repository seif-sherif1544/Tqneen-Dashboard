// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";

// ** Next Import
import { useRouter } from 'next/router'



// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)



  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    let ignore = false;

    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      setUser(JSON.parse(window.localStorage.getItem('userData')))


      // Check if token is expired
      const isTokenExpired = (token) => {
        if (!token) return true; // If no token, consider it expired
        try {
          const decodedToken = jwtDecode(token);

          const expirationTime = decodedToken?.exp * 1000; // Convert to milliseconds
          console.log("expire ", expirationTime)
          console.log("stored ", storedToken)
          console.log("expireat  ", Date.now() >= expirationTime)
          return Date.now() >= expirationTime;
        } catch (error) {
          console.error("Token decoding error:", error);

          return true; // Malformed token is considered expired
        }
      };

      if (isTokenExpired(storedToken)) {
        // Clean up local storage and redirect to login
        localStorage.removeItem('userData');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        setUser(null);
        setLoading(false);
        router.replace('/login');

        return;
      }



      if (!storedToken) {
        setLoading(true)

        await axios
          .get(authConfig.loginEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.user })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()

    // return () => {
    //   ignore = true;
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        console.log({ response });

        window.localStorage.setItem(authConfig.storageTokenKeyName, response?.data?.token)

        const returnUrl = router.query.returnUrl
        console.log({ returnUrl })
        setUser(response?.data?.user)
        window.localStorage.setItem('userData', JSON.stringify(response?.data?.user) || null)
        const redirectURL = returnUrl && returnUrl === 'Lawyer' ? returnUrl : 'Lawyer'
        console.log({ redirectURL })
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
