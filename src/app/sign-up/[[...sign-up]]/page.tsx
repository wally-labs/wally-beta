import { SignUp } from "@clerk/nextjs";
// import LogInPage from "../../_components/login";

export default function CustomSignIn() {
  // return <LogInPage />;
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
