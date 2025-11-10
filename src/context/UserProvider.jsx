import { useState } from "react"
import { UserContext } from "./UserContext"
import axios from "axios"

export default function UserProvider({children}) {
  const userFromStorage = sessionStorage.getItem("user")
  const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email: "", password: ""})

  const signUp = async (u) => {
    const headers = { headers: {"Content-Type": "application/json"}}
    await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, JSON.stringify({user: u}), headers)
    setUser({email: "", password: ""})
  }

  const signIn = async (u) => {
    const headers = { headers: {"Content-Type": "application/json"}}
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, JSON.stringify({user: u}), headers)
    sessionStorage.setItem("user", JSON.stringify(response.data))
    setUser(response.data)
  }

  return (
    <UserContext.Provider value={{user, setUser, signUp, signIn}}>
      {children}
    </UserContext.Provider>
  )
}
