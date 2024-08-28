"use client";

import { redirect } from "next/dist/client/components/navigation";

import { useRouter } from 'next/navigation';

export function LogoutButton({ children }: { children: string }) {
    "use client";
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/v0/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                // Redirect to login page
                router.push('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <button onClick={handleLogout} className='bg-red-500 hover:bg-red-600 text-white m-5 p-2 rounded'>
            {children}
        </button>
    );
};


export function CreateButton({ children } : {children: string}) {
    return (
        <button className='bg-blue-500 hover:bg-blue-600 text-white m-5 p-2 rounded'>
            {children}
        </button>
    );
};

export function EditButton({ children } : {children: string}) {
    return (
        <button className='bg-blue-500 hover:bg-blue-600 text-white p-2 rounded'>
            {children}
        </button>
    );
};

export function DeleteButton({ children } : {children: string}) {
    return (
        <button className='bg-red-500 hover:bg-red-600 text-white p-2 rounded'>
            {children}
        </button>
    );
};

export function SaveButton({ children } : {children: string}) {
    return (
        <button className='bg-green-500 hover:bg-green-600 text-white p-2 rounded'>
            {children}
        </button>
    );
};

export function CancelButton({ children, ...props } : {children: string}) {
    return (
        <button {...props} className='bg-red-500 hover:bg-red-600 text-white p-2 rounded'>
            {children}
        </button>
    );
};

