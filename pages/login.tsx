import { useActor } from "@xstate/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form"
import AppContainer from "@/components/AppContainer"
import GlobalStateContext from "@/components/GlobalStateContext"
import classNames from "@/utils/classNames"

type LoginFormValues = {
  email: string
  password: string
}
const BUTTON_HEIGHT = "h-15"
const REDIRECT_AFTER_X_SECONDS = 5

export default function Login() {
  const router = useRouter()

  const [justLoggedIn, setJustLoggedIn] = useState(false)
  const [redirectInXSeconds, setRedirectInXSeconds] = useState(
    REDIRECT_AFTER_X_SECONDS,
  )

  const globalServices = useContext(GlobalStateContext)
  const [state] = useActor(globalServices.authService)
  const isLoggedIn = state.matches("loggedIn")
  const { send } = globalServices.authService

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>()
  const onSubmit: SubmitHandler<LoginFormValues> = ({ email, password }) => {
    send("LOG_IN", { authorizedUser: email })
    setJustLoggedIn(true)
    setTimeout(() => {
      router.push("/")
    }, REDIRECT_AFTER_X_SECONDS * 1000)
    const countdownArray = Array.from(
      { length: REDIRECT_AFTER_X_SECONDS },
      (_, index) => index + 1,
    )
    countdownArray.forEach((x) => {
      setTimeout(
        () => {
          setRedirectInXSeconds(x)
        },
        (REDIRECT_AFTER_X_SECONDS - x) * 1000,
      )
    })
  }

  return (
    <AppContainer pageTitle="Login Page (admin/admin)" bgColor="bg-gray-900">
      <div className="flex h-114 w-128 flex-col items-center justify-center rounded-lg bg-gray-800 text-lg text-white">
        {!isLoggedIn && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-96 flex-col"
          >
            <LoginInput
              placeholder="user@email.com"
              fieldName="email"
              register={register}
              errors={errors}
            />
            <LoginInput
              placeholder="*********"
              fieldName="password"
              register={register}
              errors={errors}
            />
            <FormButton type="login" />
          </form>
        )}
        {isLoggedIn && (
          <div className="flex w-96 flex-col space-y-4 text-center">
            <h2>
              {justLoggedIn && "Successfully"}
              {!justLoggedIn && "Currently"} logged in as{" "}
              {state.context.authorizedUser}
            </h2>
            {justLoggedIn && (
              <>
                <h3>Redirecting in {redirectInXSeconds} seconds...</h3>
                <h3>
                  Click{" "}
                  <Link href="/">
                    <span className="underline">here</span>
                  </Link>{" "}
                  if you are not redirected.
                </h3>
              </>
            )}
            {!justLoggedIn && (
              <FormButton
                type="logout"
                onClick={() => {
                  send("LOG_OUT")
                }}
              />
            )}
          </div>
        )}
      </div>
    </AppContainer>
  )
}

function LoginInput({
  placeholder,
  fieldName,
  register,
  errors,
}: {
  placeholder: string
  fieldName: keyof LoginFormValues
  register: UseFormRegister<LoginFormValues>
  errors: FieldErrors
}) {
  const isPassword = fieldName === "password"

  return (
    <>
      {errors[fieldName]?.type === "required" && <Required />}
      {errors[fieldName]?.type === "validate" && (
        <Invalid fieldName={fieldName} />
      )}
      <input
        placeholder={placeholder}
        {...register(fieldName, {
          required: true,
          validate: (value) => value === "admin",
        })}
        className={classNames(
          BUTTON_HEIGHT,
          "mb-7 rounded-lg bg-gray-700 pl-4",
          isPassword ? "pt-1 text-2xl placeholder-shown:pt-3" : "pt-1",
        )}
        type={isPassword ? "password" : "text"}
      />
    </>
  )

  function Required() {
    return <FormError text="This field is required" />
  }

  function Invalid({ fieldName }: { fieldName: string }) {
    return <FormError text={`The only valid ${fieldName} is admin`} />
  }

  function FormError({ text }: { text: string }) {
    return (
      <div role="alert" aria-live="polite">
        <span role="img" aria-label="Error">
          ⚠️
        </span>
        {text}:
      </div>
    )
  }
}

function FormButton({
  type,
  onClick,
}: {
  type: "login" | "logout"
  onClick?: () => void
}) {
  return (
    <button
      type={type === "login" ? "submit" : undefined}
      className={classNames(
        "mt-4 rounded-lg bg-yellow-400 p-2 font-bold uppercase",
        BUTTON_HEIGHT,
      )}
      onClick={type === "logout" ? onClick : undefined}
    >
      {type === "login" ? "Login" : "Logout"}
    </button>
  )
}
