import ParticleBackground from "./background";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ParticleBackground />
      {children}
    </>
  );
}



