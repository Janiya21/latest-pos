// pages/signin.tsx
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Call signIn from NextAuth
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            // Redirect to the home page on successful sign-in
            router.push('/');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <div className="flex pt-16 justify-center items-center bg-white">
                <form onSubmit={handleSubmit} className="p-10 border-[1px] -mt-10 border-slate-200 rounded-md flex flex-col items-center space-y-3">
                <div className="text-center py-4">
                    <img width="200" className="mx-auto" src="https://kit8.net/wp-content/uploads/edd/2022/04/password_preview.jpg" alt="Logo" />
                    <h2 className='mt-4 text-gray-900 font-extrabold'>WELCOME TO NBM</h2>
                </div>
                    <input onChange={(e) => setUsername(e.target.value)} className="p-3 border-[1px] border-slate-500 rounded-sm w-80" placeholder="E-Mail or Phone number" />
                    <div className="flex flex-col space-y-1">
                        <input type='password'   onChange={(e) => setPassword(e.target.value)} className="p-3 border-[1px] border-slate-500 rounded-sm w-80" placeholder="Password" />
                        <p className="font-bold text-gray-800] py-2">Forgot password?</p>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="flex flex-col space-y-5 w-full">
                        <button type='submit' className="w-full bg-gray-900 rounded-xl p-3 text-white font-bold transition duration-200 hover:bg-gray-800">Log in</button>
                        <div className="flex items-center justify-center border-t-[1px] border-t-slate-300 w-full relative">
                            <div className="-mt-1 font-bod bg-white px-5 absolute">Or</div>
                        </div>
                        <button className="w-full border-gray-900 hover:border-gray-900 hover:border-[2px] border-[1px] rounded-xl p-3 text-black font-bold transition duration-200">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
