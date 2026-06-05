'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/services/auth.service';

const Signoutbtn = () => {
        const router = useRouter();
    
    const handleSignOut = async () => {
      try {
        await signOutUser(router);
      //   router.replace("/login"); // Optional redirect after logout
      } catch (err: any) {
        alert("Failed to log out: " + err.message);
      }
    };
      
  return (
    <Button className="w-full rounded" variant={'outline'} onClick={handleSignOut}>Sign out</Button>
  )
}

export default Signoutbtn