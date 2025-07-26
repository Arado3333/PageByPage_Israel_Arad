"use client";

import AppLayout from "../components/AppLayout";
import { BookContext } from "../context/BookContext"; //Not working YET

export default function DraftsLayout({ children }) {
    async function getProjects() {
        const { userId, token } = JSON.parse(sessionStorage.getItem("user"));

        const response = await fetch(
            `http://localhost:5500/api/projects/${userId}`,
            {
                headers: {
                    Authentication: `Bearer ${token}`,
                },
            }
        );

        const books = await response.json();
        return books;
    }

    const books = getProjects();

    return (
        <BookContext.Provider value={books}>
            <AppLayout>{children}</AppLayout>
        </BookContext.Provider>
    );
}
