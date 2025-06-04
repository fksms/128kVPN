export default function ResetPasswordPage() {
    return (
        <div>
            <div className='relative flex flex-col items-center justify-center h-screen overflow-hidden px-8'>
                <div className='w-full p-6 bg-base-100 rounded-md shadow-lg max-w-sm'>
                    <h1 className='text-3xl font-semibold text-center text-gray-700'>DaisyUI</h1>
                    <form className='space-y-4'>
                        <div>
                            <label className='label'>
                                <span className='text-base label-text'>New Password</span>
                            </label>
                            <input
                                type='password'
                                placeholder='Enter New Password'
                                className='w-full input input-bordered'
                            />
                        </div>
                        <div>
                            <label className='label'>
                                <span className='text-base label-text'>Confirm Password</span>
                            </label>
                            <input
                                type='password'
                                placeholder='Confirm New Password'
                                className='w-full input input-bordered'
                            />
                        </div>
                        <div className='pt-2'>
                            <button className='btn btn-block btn-neutral'>Reset Password</button>
                        </div>
                        <div className='text-center'>
                            <a href='/login' className='text-blue-600 hover:text-blue-800 hover:underline'>
                                Back to Login
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
