import { SignUp } from "@clerk/nextjs";

export default function CustomSignUp() {
  return (
    <div className="flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-amberTheme hover:bg-amberTheme-darker border-amberTheme shadow-amberTheme",
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
