import { SignIn } from "@clerk/nextjs";

export default function CustomSignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-amberTheme hover:bg-amberTheme-darker border-amberTheme",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            logoImageUrl: "/favicon.ico",
          },
        }}
      />
    </div>
  );
}
