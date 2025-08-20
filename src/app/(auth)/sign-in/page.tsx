import { LoginForm } from "@/components/auth/login-form"
import { Ripple } from "@/components/magicui/ripple"

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        <Ripple className="opacity-30" />
      </div>
    </div>
  )
}
