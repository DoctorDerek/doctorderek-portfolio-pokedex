import { useActor } from "@xstate/react"
import Link from "next/link"
import { useContext, useEffect } from "react"
import GlobalStateContext from "@/components/GlobalStateContext"
import authMachine, {
  LOCALSTORAGE_KEY_AUTH,
  validateHashToken,
} from "@/utils/authMachine"
import { getErrorMessage } from "@/utils/getErrorMessage"

export default function UserAuthComponent() {
  const globalServices = useContext(GlobalStateContext)
  const [state] = useActor(globalServices.authService)
  const isLoggedIn = state.matches("loggedIn")
  const { send } = globalServices.authService

  useEffect(() => {
    const localStorageString = localStorage.getItem(LOCALSTORAGE_KEY_AUTH)
    try {
      const localStorageObject = localStorageString
        ? (JSON.parse(localStorageString) as typeof authMachine.schema.context)
        : null
      if (
        localStorageObject &&
        localStorageObject?.authorizedUser &&
        localStorageObject?.authToken
      ) {
        const { authorizedUser, authToken } = localStorageObject
        const isValidAuthToken = validateHashToken({
          user: authorizedUser,
          token: authToken,
        })
        if (isValidAuthToken) send("LOG_IN", { authorizedUser })
      }
    } catch (e) {
      console.error(getErrorMessage(e))
    }
  }, [send])

  return (
    <div>
      {isLoggedIn && (
        <>
          Logged In as {state.context.authorizedUser}
          {" | "}
          <button type="button" onClick={() => send("LOG_OUT")}>
            Logout
          </button>
        </>
      )}
      {!isLoggedIn && (
        <>
          Logged Out{" | "}
          <Link href="/login">Login</Link>
        </>
      )}
    </div>
  )
}
