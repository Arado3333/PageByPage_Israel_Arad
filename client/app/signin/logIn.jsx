//server-side logic
export const logIn = async (email, password) => {
    try {
        let result = await fetch("http://localhost:5500/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        return await result.json();
    } catch (error) {
        return { error };
    }
};
