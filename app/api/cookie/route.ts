import { cookies } from "next/headers";


// return all cookies in object as { cookieName: cookieValue,  }
export const GET = (req: Request) => {
    const cookies_: any = {};

    for (const cookie of cookies().getAll()) {
        cookies_[cookie.name] = cookie.value;
    }

    console.log(cookies().getAll());

    if (!("language" in cookies_)) {
        cookies_.language = "EN"; // by default
    }

    return new Response(JSON.stringify(cookies_));
}


// set all cookies in body.cookies as list of
// [{ name: cookieName, value: cookieValue, expires:? expirationTime }, ]
export const POST = async (req: Request) => {
    const body = await req.json();

    for (const cookie of body.cookies) {
        cookies().set(cookie);
    }

    return new Response(JSON.stringify({ message: "Cookies set successfully." }), { status: 201 });
}