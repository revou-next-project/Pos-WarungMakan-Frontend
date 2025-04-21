import { API_AUTH_LOGIN } from "../constans/api";

export const loginAuth = async (username: string, password: string) => {
    try {
        const response = await fetch(API_AUTH_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error
                ? `${errorData.error}`
                : `${errorData.detail}`;
            
            throw new Error(errorMessage);
            
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};