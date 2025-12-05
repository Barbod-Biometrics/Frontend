import UnifiedParticleBackground from "./UnifiedParticleBackground";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UnifiedParticleBackground />
      {children}
    </>
  );
}
