import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <SignIn
          appearance={{
            elements: {
              footerAction: { display: "none" },
            },
          }}
          path="/login"
          routing="virtual"
        />
      </section>
    </div>
  );
}
