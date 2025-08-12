"use server";

import { redirect } from "next/navigation";
import {
    getProjectsWithCookies,
    login,
    updateDataToServer,
} from "../api/routes.js";
import { createSession, deleteSession } from "./session";
import Draft from "./models/draft.model.js";

export async function loginAct(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await login(email, password);

    if (!result.userID) {
        return {
            errors: result.message,
        };
    }

    await createSession(result.userID);

    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    redirect("/signin");
}

export async function updateProjectData(prevState, formData) {
    const selectedProject = formData.get("book");
    const content = formData.get("snippet");
    const title = formData.get("title");

    let wordCount = content.split(" ").length;

    let nDraft = new Draft(
        title,
        [{ id: 1, title: title, content: content }],
        content,
        "scene",
        wordCount
    );

    let newEditDraft = {
        ...nDraft,
    };

    const books = await getProjectsWithCookies();

    const projectObj = books.filter((book) => book.title === selectedProject);
    let allDrafts = projectObj[0].drafts || [];
    allDrafts.push(newEditDraft);

    await updateDataToServer(projectObj, allDrafts);

    redirect("/drafts");
}
