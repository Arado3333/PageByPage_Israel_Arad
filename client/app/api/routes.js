"use server";

import { cookies } from "next/headers";
import { decrypt, getSessionToken, getSessionObject } from "../lib/session";

export async function getProjectsWithCookies() {
    //with cookie data - server side

    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    const decrypted = await decrypt(session?.value);
    const userId = decrypted.userId;

    //fetch projects from db
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${session.value}`,
            },
            method: "GET",
        }
    );
    return await response.json();
}

export async function getUserStats() {
    const projects = await getProjectsWithCookies();

    let sum = 0;

    // Combine drafts from all projects
    const drafts = projects.flatMap((project) => project.drafts || []);
    const wordCounts = drafts.map((draft) => draft.wordCount);

    wordCounts.forEach((count) => (sum += count));

    // Gather all chapters from all projects
    const allChapters = projects.flatMap((project) => project.chapters || []);

    const stats = {
        totalBooks: projects.length,
        totalDrafts: drafts.length,
        totalWords: sum,
        chaptersCompleted: allChapters.length,
    };

    return stats;
}

export async function getRecentDrafts()
{
    const projects = await getProjectsWithCookies();
    const drafts = projects.flatMap((project) => project.drafts || []); //All the drafts

    return drafts.slice(0, 3);
}

export async function getWritingGoals() {

    const today = new Date();
    const projects = await getProjectsWithCookies();
    const drafts = projects.flatMap((project) => project.drafts || []);
    let todayWords = 0;
    let yesterdayWords = 0;

    let todayDrafts = drafts.filter((draft) => draft.lastEdited.split("T")[0] === new Date().toISOString().split("T")[0]);
    todayDrafts.forEach((draft) => todayWords += draft.wordCount);

    // Calculate yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let yesterdayDrafts = drafts.filter((draft) => draft.lastEdited.split("T")[0] === yesterdayStr);
    yesterdayDrafts.filter((draft) => yesterdayWords += draft.wordCount);
    

    let obj = {
        current: todayWords,
        target: yesterdayWords,
        percentage: todayWords === 0 ? 0 : Math.round((todayWords / yesterdayWords) * 100)
    };

    return obj;
}


export async function getTokenFromCookies() {
    return await getSessionToken();
}

export async function getSession() {
    return await getSessionObject();
}

export async function updateDataToServer(selectedProject, updatedData, status) {
    const { userId } = await getSession();
    const token = await getSessionToken();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${selectedProject[0]._id}`,
        {
            headers: {
                Authentication: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify({
                userId: userId,
                author: selectedProject[0].author,
                title: selectedProject[0].title,
                genres: selectedProject[0].genres,
                status: status || selectedProject.status,
                description: selectedProject[0].description,
                drafts: updatedData,
            }),
        }
    );
    const result = await response.json();

    return result;
}

export async function updateBook(updatedBook) {
    const token = getSessionToken();

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${updatedBook._id}`, //projectId
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify(updatedBook),
            }
        );

        if (!response.ok) {
            return await response.json();
        } else {
            return await response.json();
        }
    } catch (error) {
        return error;
    }
}

export async function createProject(newProject) {
    const { userId } = await getSession();
    const token = await getSessionToken();

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/`,
            {
                headers: {
                    Authentication: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    userId: userId,
                    author: newProject.author,
                    title: newProject.title,
                    genres: newProject.genres,
                    status: newProject.status,
                    description: newProject.description,
                    drafts: newProject.drafts,
                    notes: newProject.notes,
                    characters: newProject.characters,
                    assets: newProject.assets,
                }),
            }
        );

        return await response.json();
    } catch (error) {
        return error;
    }
}

export async function deleteBook(bookToDelete, token) {
    const idToDelete = bookToDelete[0]._id;

    const getBookResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/books/${idToDelete}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        }
    );
    const bookObj = await getBookResponse.json();

    const delBookResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/books/${bookObj.book._id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "DELETE",
        }
    );
    return await delBookResponse.json();
}

export async function deleteProject(idToDelete, token) {
    const delProjResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${idToDelete}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "DELETE",
        }
    );
    return await delProjResponse.json();
}

export async function deleteDraft(parentProject, deleteConfirmId) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${parentProject._id}/${deleteConfirmId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return await res.json();
    } catch (err) {
        return err;
    }
}

export async function getTasks() {
    const sessionObj = await getSessionObject();
    const token = await getSessionToken();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/${sessionObj.userId}`,
        {
            headers: {
                Authentication: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    const result = await response.json();
    console.log(result.tasks); // --> will be indicating success or fail message
    return result.tasks; // --> Array of task objects
}

export async function updateTask(task) {
    const sessionObj = await getSessionObject();
    const token = await getSessionToken();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/new`,
        {
            headers: {
                Authentication: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                task: task,
                userId: sessionObj.userId,
            }),
        }
    );

    return await response.json();
}

export async function deleteTask(taskId) {
    const sessionObj = await getSessionObject();
    const token = await getSessionToken();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/${taskId}`,
        {
            headers: {
                Authentication: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({
                userId: sessionObj.userId,
            }),
        }
    );
    return await response.json();
}

export async function login(email, password) {
    try {
        let result = await fetch(
            `${process.env.NEXT_PUBLIC_SERVICE}/api/users/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            }
        );
        return await result.json();
    } catch (error) {
        return { error };
    }
}

export async function getVersions(project, token) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/versions/${project[0]._id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return await res.json();
}
