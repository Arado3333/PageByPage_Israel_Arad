export async function getProjects(userId, token) {
    //fetch projects from db
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        }
    );
    return await response.json();
}

export async function updateDataToServer(
    selectedProject,
    updatedData,
    status,
    userId,
    token
) {
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
    console.log("Attempting to update book on server:", updatedBook);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVICE}/api/projects/${updatedBook._id}`, //projectId
            {
                headers: {
                    Authorization: `Bearer ${keys.token}`,
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify(updatedBook),
            }
        );

        if (!response.ok) {
            return await response.json();
            // TODO: Handle server-side errors (e.g., show a toast notification)
        } else {
            return await response.json();
            // TODO: Handle successful server update (e.g., show a success message)
        }
    } catch (error) {
        return error;
    }
}

export async function createProject(newProject, token) {
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
                    userId: newProject.userId,
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

    console.log(bookObj.book._id);

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

export async function getTasks(userID, token) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/${userID}`,
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

export async function updateTask(task, userID, token) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/new`,
        {
            headers: {
                Authentication: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                userId: userID,
                task: task,
            }),
        }
    );

    return await response.json();
}

export async function deleteTask(taskId, userID, token) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVICE}/api/tasks/${taskId}`,
        {
            headers: {
                Authentication: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "DELETE",
            body: JSON.stringify({
                userId: userID,
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
