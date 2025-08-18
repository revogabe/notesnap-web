import { authClient } from "@/lib/auth-client"

export function getAuthUser() {
  const user = authClient.useSession()
  if (user.data) return { ...user.data.session }
}
