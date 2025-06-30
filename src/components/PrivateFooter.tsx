'use client';

export default function PrivateFooter() {
    return (
        <div>
            <footer className='footer footer-horizontal footer-center bg-[var(--background)] text-gray-400 py-4'>
                <div className='flex flex-col mx-auto max-w-full min-w-xs'>
                    <aside>
                        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
                    </aside>
                </div>
            </footer>
        </div>
    );
}
