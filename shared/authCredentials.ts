export function hasValidPasswordLoginCredentials(email: string, password: string) {
  return /\S+@\S+\.\S+/.test(email.trim()) && password.length >= 6;
}
