import ParticleBackground from "./background";
import { LoginProvider } from "./login-context";
import UnifiedParticleBackground from "./UnifiedParticleBackground";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoginProvider>
      <UnifiedParticleBackground />
      {children}
    </LoginProvider>
  );
}
