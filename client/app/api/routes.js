"use server";

export async function getProjects(userId, token) {
    //fetch projects from db
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROJECTS}/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
        }
    );
    return await response.json();
}

export async function updateDataToServer(selectedProject, updatedData, status, userId, token) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROJECTS}/${selectedProject[0]._id}`,
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
                status: status,
                description: selectedProject[0].description,
                drafts: updatedData,
            }),
        }
    );
    const result = await response.json();

    return result;
}


