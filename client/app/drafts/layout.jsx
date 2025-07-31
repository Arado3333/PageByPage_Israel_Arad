"use client";

import { getProjects } from "../api/routes";
import AppLayout from "../components/AppLayout";
import { BookContext } from "../context/BookContext"; //Not working YET

export default function DraftsLayout({ children }) {
    async function getProjectsFromServer() {
        const { userId, token } = JSON.parse(sessionStorage.getItem("user"));

        const books = await getProjects(userId, token);
        return books;
    }

    const books = getProjectsFromServer();

    return (
        <BookContext.Provider value={books}>
            <AppLayout>{children}</AppLayout>
        </BookContext.Provider>
    );
}
