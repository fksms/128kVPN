export const getCookieValueForClient = (name: string): string | undefined => {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))
        ?.substring(`${name}=`.length);
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
};
