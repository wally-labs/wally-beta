import { SignIn } from "@clerk/nextjs";
// import LogInPage from "../../_components/login";

export default function CustomSignIn() {
  // return <LogInPage />;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
