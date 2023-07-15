// parse client side cookies and return as object
export const getCookies = () => {
    const cookies_: any = {};

    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        cookies_[key] = value;
    }

    if (!("language" in cookies_)) {
        cookies_.language = "EN"; // by default
    }

    return cookies_;
}