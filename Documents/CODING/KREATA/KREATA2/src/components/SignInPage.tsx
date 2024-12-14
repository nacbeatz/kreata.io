import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SidebarProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

interface LoginFormProps {
    onLoginSuccess: (user: { email: string; password: string }) => void;
}

const SignInPage: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [agreeToPolicy, setAgreeToPolicy] = useState(false);
    const [hasAccount, setHasAccount] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = { email, password };
        console.log("Signed in:", { email, password });
        onLoginSuccess(user);
        toast.success("Login successful!", { position: toast.POSITION.TOP_CENTER });
        navigate("/Dashboard");
    };

    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!agreeToPolicy) {
            alert("Please agree to the Privacy and Policy to register.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }
        console.log("Registered:", { firstName, lastName, email, password });
        setHasAccount(true);
        toast.success("Registration successful!", { position: toast.POSITION.TOP_CENTER });
    };

    return (
        <div
            className="h-screen flex flex-col justify-center items-center relative"
            style={{
                background: "radial-gradient(circle, #01356B, #081028)",
            }}
        >
            <div className="absolute top-4 left-6 flex items-center">
                <h1 className="text-[#E1F812] font-bold text-2xl">KREATA.IO</h1>
            </div>

            <form
                onSubmit={hasAccount ? handleSignIn : handleSignUp}
                style={{
                    boxShadow:
                        "0 8px 20px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(255, 255, 255, 0.2)",
                }}
                className="p-8 sm:p-12 rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-xl"
            >
                <h2 className="text-2xl font-bold text-white mb-4 text-center">
                    {hasAccount ? "SIGN IN" : "REGISTER"}
                </h2>
                <p className="text-gray-400 mb-6 text-center">
                    {hasAccount
                        ? "Sign in to your account"
                        : "Create an account to get started"}
                </p>

                {!hasAccount && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-white"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-2 block w-full h-8 px-3 py-2 text-white rounded-md shadow-sm bg-gray-900 border border-transparent focus:ring focus:ring-[#E1F812] focus:border-[#E1F812] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-white"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-2 block w-full h-8 px-3 py-2 text-white rounded-md shadow-sm bg-gray-900 border border-transparent focus:ring focus:ring-[#E1F812] focus:border-[#E1F812] focus:outline-none"
                            />
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 block w-full h-8 px-3 py-2 text-white rounded-md shadow-sm bg-gray-900 border border-transparent focus:ring focus:ring-[#E1F812] focus:border-[#E1F812] focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-white"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-2 block w-full h-8 px-3 py-2 text-white rounded-md shadow-sm bg-gray-900 border border-transparent focus:ring focus:ring-[#E1F812] focus:border-[#E1F812] focus:outline-none"
                    />
                </div>

                {!hasAccount && (
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-white"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            className="mt-2 block w-full h-8 px-3 py-2 text-white rounded-md shadow-sm bg-gray-900 border border-transparent focus:ring focus:ring-[#E1F812] focus:border-[#E1F812] focus:outline-none"
                        />
                    </div>
                )}

                <div className="mb-6 flex flex-col gap-4">
                    {!hasAccount && (
                        <label className="flex items-center text-gray-400">
                            <input
                                type="checkbox"
                                checked={agreeToPolicy}
                                onChange={(e) =>
                                    setAgreeToPolicy(e.target.checked)
                                }
                                className="mr-2 w-5 h-5 text-green-500 bg-gray-800 rounded focus:ring-green-500"
                            />
                            <span className="text-white">
                                I agree to the{" "}
                                <a
                                    href="/privacy-policy"
                                    className="text-[#E1F812] font-bold ml-1 hover:underline"
                                >
                                    Privacy and Policy
                                </a>
                            </span>
                        </label>
                    )}
                </div>

                {hasAccount && (
                    <div className="flex justify-between items-center mb-6">
                        <label className="flex items-center text-white">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="mr-2 w-5 h-5 text-green-500 bg-gray-800 rounded focus:ring-green-500"
                            />
                            <span className="text-white">Remember Me</span>
                        </label>
                        <a
                            href="/forgot-password"
                            className="text-[#E1F812] hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-1 px-6 text-lg font-bold text-[#052640] bg-gradient-to-r from-[#E1F812] to-[#25A906]
            rounded-xl shadow-md hover:opacity-90 transition-opacity hover:scale-105 duration-50"
                >
                    {hasAccount ? "LOGIN" : "REGISTER"}
                </button>

                <p className="text-sm text-gray-400 mt-4 text-center">
                    {hasAccount
                        ? "Don’t have an account?"
                        : "Already have an account?"}{" "}
                    <button
                        type="button"
                        className="text-[#E1F812] font-bold hover:underline"
                        onClick={() => setHasAccount(!hasAccount)}
                    >
                        {hasAccount ? "Register" : "Sign In"}
                    </button>
                </p>

                {hasAccount && (
                    <>
                        <div className="mt-10 grid grid-cols-3 items-center text-gray-400">
                            <hr className="border-gray-400" />
                            <p className="text-center">OR</p>
                            <hr className="border-gray-400" />
                        </div>
                        <div className="relative flex justify-center">
                            <button className="bg-white flex items-center justify-center py-1 px-2 w-full rounded-xl mt-5 border border-gradient-to-r from-[#E1F812] to-[#25A906] hover:scale-105 duration-100">
                                <img
                                    src="./google.png"
                                    className="w-4 h-4 mr-2"
                                />
                                Login with Google
                            </button>
                        </div>
                    </>
                )}
            </form>

            {/* Toast container */}
            <div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default SignInPage;
