import { assign, createMachine } from "xstate"

export const hashAuthToken = ({ user }: { user: string }) =>
  `VALID_AUTH_TOKEN_${user}`

export const validateHashToken = ({
  user,
  token,
}: {
  user: string
  token: string
}) => token === hashAuthToken({ user })

export const LOCALSTORAGE_KEY_AUTH = "pokedex-context-key"

const authMachine = createMachine(
  {
    id: "auth",
    tsTypes: {} as import("./authMachine.typegen").Typegen0,
    schema: {
      context: {} as { authorizedUser: string; authToken: string },
      events: {} as
        { type: "LOG_IN"; authorizedUser: string } | { type: "LOG_OUT" },
    },
    initial: "loggedOut",
    context: {
      authorizedUser: "",
      authToken: "",
    },
    states: {
      loggedOut: {
        on: {
          LOG_IN: {
            target: "loggedIn",
            actions: ["updateUserInContext", "saveUserToLocalStorage"],
          },
        },
      },
      loggedIn: {
        on: {
          LOG_OUT: {
            target: "loggedOut",
            actions: ["clearUserFromContext", "clearUserFromLocalStorage"],
          },
        },
      },
    },
  },
  {
    actions: {
      updateUserInContext: assign({
        authorizedUser: (context, event) => event.authorizedUser,
        authToken: (context, event) =>
          hashAuthToken({ user: event.authorizedUser }),
      }),
      saveUserToLocalStorage: (context) =>
        localStorage.setItem(LOCALSTORAGE_KEY_AUTH, JSON.stringify(context)),
      clearUserFromContext: assign({
        authorizedUser: () => "",
        authToken: () => "",
      }),
      clearUserFromLocalStorage: () =>
        localStorage.removeItem(LOCALSTORAGE_KEY_AUTH),
    },
  },
)

export default authMachine
