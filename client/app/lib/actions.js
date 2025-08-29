"use server";

import { redirect } from "next/navigation";
import {
    getProjectsWithCookies,
    login,
    updateBook,
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

import cloudinary from "./cloudinary";

export async function uploadAction(prevState, formData) {
    //preparing DB update
    const book = JSON.parse(formData.get("book"));
    const name = formData.get("title");
    const type = formData.get("assetType");
    const description = formData.get("description");

    //preparing cloudinary upload
    const file = formData.get("uploadFile");
    const folder = formData.get("folder") || undefined;
    const resourceType = formData.get("assetType") || "auto";

    if (!file) {
        return { error: "Please choose a file." };
    }

    const res = await uploadToCloudinary(file, { folder, resourceType });
    const result = { url: res.secure_url, public_id: res.public_id };

    let updatedAsset = {
        name: name,
        type: type,
        description: description,
        url: result.url,
    };

    let updatedAssets = book.assets
        ? [...book.assets, updatedAsset]
        : [updatedAsset];

    let updatedBook = {
        ...book,
        assets: updatedAssets,
    };

    const dbResult = await updateBook(updatedBook);
    console.log(dbResult);

    redirect("/books");
}

// Accepts either a publicId or a Cloudinary URL
export async function deleteFromCloudinary(publicIdOrUrl, resourceType = "auto") {
    // resourceType: "image", "video", or "raw" (for pdf, doc, etc.)
    if (!publicIdOrUrl) throw new Error("No public_id or url provided");
    let publicId = publicIdOrUrl;
    // If it's a URL, extract the public_id
    if (publicIdOrUrl.startsWith("http")) {
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/my_image.jpg
        // We want: folder/my_image (without extension and version)
        try {
            const url = new URL(publicIdOrUrl);
            const parts = url.pathname.split("/");
            const uploadIdx = parts.findIndex((p) => p === "upload");
            if (uploadIdx !== -1 && parts.length > uploadIdx + 1) {
                // Remove version if present (e.g. v1234567890)
                let publicIdParts = parts.slice(uploadIdx + 1);
                if (
                    publicIdParts[0].startsWith("v") &&
                    !isNaN(Number(publicIdParts[0].slice(1)))
                ) {
                    publicIdParts = publicIdParts.slice(1);
                }
                // Remove file extension
                const last = publicIdParts[publicIdParts.length - 1];
                publicIdParts[publicIdParts.length - 1] = last.replace(
                    /\.[^.]+$/,
                    ""
                );
                publicId = publicIdParts.join("/");
            }
        } catch (e) {
            throw new Error("Invalid Cloudinary URL");
        }
    }
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            publicId,
            { resource_type: resourceType },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
}

async function uploadToCloudinary(file, options) {
    //Assumes file of type File (Blob from file reader)
    if (!file) throw new Error("No file provided");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type:
                    (options?.resourceType === "application/pdf" && "raw") ||
                    "auto",
                folder: options?.folder || "server-actions",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

export async function redirectTo(pathname)
{
    redirect(`${pathname}`);
}
