"use client";
import React from 'react'
import { Button } from '../app/books/ui/button'
import { redirectTo } from '../app/lib/actions.js'

export default function RedirectButton({ buttonText, pathname }) {
    return (
        <button className='w-full bg-transparent border-2 border-blue-700 hover:bg-blue-700 text-black hover:text-white-300 font-bold py-2 px-3 rounded' onClick={() => redirectTo(`${pathname}`)}>
            {buttonText}
        </button>
    );
}
