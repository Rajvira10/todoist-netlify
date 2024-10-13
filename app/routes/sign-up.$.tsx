import { SignUp } from "@clerk/remix";

const SignUpRoute = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <SignUp />
    </div>
  );
};

export default SignUpRoute;
