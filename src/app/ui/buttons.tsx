"use client";

import { redirect } from "next/dist/client/components/navigation";



export function LogoutButton({ children } : {children: string}) {
    const handleLogout = () => {
        fetch('/api/v0/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        }).then(() => {
            // Redirect to login page in a client-side navigation
            redirect('/login');
        });
    };

    return (
        <button onClick={handleLogout} className='bg-red-500 hover:bg-red-600 text-white m-5 p-2 rounded'>
            {children}
        </button>
    );
};