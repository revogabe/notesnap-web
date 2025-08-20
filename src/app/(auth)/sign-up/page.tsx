import { RegisterForm } from "@/components/auth/register-form"
import { Ripple } from "@/components/magicui/ripple"

export default function RegisterPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
        <Ripple className="opacity-30" />
      </div>
    </div>
  )
}
