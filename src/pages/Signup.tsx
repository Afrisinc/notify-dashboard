import BackgroundDecorator from "@/components/auth/BackgroundDecorator";
import SignupForm from "@/components/auth/signup/SignupForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6 relative">
      <BackgroundDecorator />
      <div className="relative z-10">
        <SignupForm />
      </div>
    </div>
  );
};

export default Register;
