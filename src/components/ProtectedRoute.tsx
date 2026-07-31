export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Auth disabled for development
  return <>{children}</>
}
