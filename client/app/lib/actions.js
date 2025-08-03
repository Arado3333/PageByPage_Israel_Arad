"use server";

import { redirect } from "next/navigation";
import { login } from "../api/routes.js";
import { createSession, deleteSession } from "./session";

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

export async function logout() 
{
    await deleteSession();
    redirect("/signin");
}
