"use server";

import { cookies } from "next/headers";
import { decrypt, getSessionToken, getSessionObject } from "../lib/session";
import { GoogleGenAI } from "@google/genai";

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

export async function getRecentDrafts() {
    const projects = await getProjectsWithCookies();
    const drafts = projects.flatMap((project) => project.drafts || []); //All the drafts

    return drafts.slice(0, 3);
}

export async function getRecentDrafts_noSlice() {
    const projects = await getProjectsWithCookies();
    const drafts = projects.flatMap((project) => project.drafts || []); //All the drafts

    return drafts;
}

export async function calcWritingStreak() {
    const recentDrafts = await getRecentDrafts_noSlice();
    const days = 6;
    const today = new Date();
    const streak = [];

    for (let i = 0; i <= days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const hasDraft = recentDrafts.some(
            (draft) =>
                draft.lastEdited && draft.lastEdited.split("T")[0] === dateStr
        );
        streak.unshift(hasDraft);
    }
    const streakCount = streak.reduce(
        (currentStreak, isWritingDay) => (isWritingDay ? currentStreak + 1 : 0),
        0
    );

    const streakObj = {
        currentStreak: streakCount,
        lastWeek: streak,
    };

    return streakObj;
}

export async function getUpcomingTasks() {
    const allTasks = await getTasks();

    //all the tasks for the upcoming week, i.e, 7 days from current date.
    const now = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(now.getDate() + 7);

    const upcomingTasks = allTasks.filter((task) => {
        const due = new Date(task.year, task.month, task.day);
        return due >= now && due <= oneWeekFromNow;
    });

    let result = upcomingTasks.map((task) => {
        const date = new Date(task.year, task.month, task.day).toDateString();

        // Calculate the delta in days between today and the due date
        const deltaMs = new Date(task.year, task.month, task.day) - now;
        const deltaDays = Math.ceil(deltaMs / (1000 * 60 * 60 * 24));
        let dateInWords =
            deltaDays > 1 ? `In ${deltaDays} days` : `In ${deltaDays} day`;

        return {
            id: task._id,
            title: task.fullTitle,
            dueDate: date,
            wordDate: dateInWords,
            priority: task.priority ? task.priority : "high",
        };
    });

    return result;
}

export async function getWritingGoals() {
    const today = new Date();
    const projects = await getProjectsWithCookies();
    const drafts = projects.flatMap((project) => project.drafts || []);
    let todayWords = 0;
    let yesterdayWords = 0;

    let todayDrafts = drafts.filter(
        (draft) =>
            draft.lastEdited.split("T")[0] ===
            new Date().toISOString().split("T")[0]
    );
    todayDrafts.forEach((draft) => (todayWords += draft.wordCount));

    // Calculate yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let yesterdayDrafts = drafts.filter(
        (draft) => draft.lastEdited.split("T")[0] === yesterdayStr
    );
    yesterdayDrafts.filter((draft) => (yesterdayWords += draft.wordCount));

    let obj = {
        current: todayWords,
        target: yesterdayWords,
        percentage:
            todayWords === 0
                ? 0
                : Math.round((todayWords / yesterdayWords) * 100),
    };
    return obj;
}

export async function getTokenFromCookies() {
    return await getSessionToken();
}

export async function getSession() {
    return await getSessionObject();
}

export async function askAI() {
    const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
    const recommedPrompt = `Based on the data you've got from the book's chapters, find improvement opportunities for each draft or chapter, and for each page in the draft or chapter. Summarize your improvement point/s as a call-to-action tip, for example: Consider varying sentence structure to improve flow... [short example/s], The character's motivation seems inconsistent with... [short example/s] so the user will react to this tip and take action to improve it. The improvement examples should rely on the input book/chapter/draft's information, and be correct grammarly. Keep on the current storyline's flow by maintaining story-like language, but consider what the writer would love to see. Your output should be a JSON object following this structure: {improvementTitle: [what the improvement is about], improveTip: [example/s for improvement]}.`;

    //collect all the chapters
    const projects = await getProjectsWithCookies();
    const allChapters = projects.flatMap((project) => project.chapters || []);

    console.log(allChapters);
    

    let allSuggestions = [];

    for (const chapter of allChapters) {
        // Prepare the prompt for this chapter
        const chapterPrompt = `
        Chapter Title: ${chapter.title || "Untitled"}
        Pages: ${Array.isArray(chapter.pages) ? chapter.pages.map((p, i) => `Page ${i + 1}: ${p}`).join("\n") : "No pages provided."}
        Content: ${chapter.content || "No content provided."}
        `;

        // Call Gemini for this chapter
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: recommedPrompt,
                maxOutputTokens: 2000,
                temperature: 0.3
            },
            contents: {
                parts: [{ text: chapterPrompt }],
            }
        });

        // Parse and store the suggestion
        let suggestion;
        try {
            let rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            // Remove markdown code block notation (e.g., ```json ... ```)
            rawText = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim();
            suggestion = JSON.parse(rawText);
        } catch (e) {
            suggestion = { error: "Invalid JSON from AI", raw: response };
        }
        allSuggestions.push({
            chapterId: chapter._id,
            improvementTitle: suggestion.improvementTitle,
            improveTip: suggestion.improveTip
        });
        
    }
    
    return allSuggestions;
}


//CRUD with Express

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
