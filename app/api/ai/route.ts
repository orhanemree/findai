import { cookies } from "next/headers";

const URL = "https://api.openai.com/v1/chat/completions";


export const POST = async (req: Request) => {
    
    const lang = cookies().get("language")?.value ?? "EN";
    const LANGUAGE = lang !== "TR" ? "english" : "turkish";
    const PROMPT_PROMPT = `you are in a deception q&a game. act like human. ask a question to other players. do some miswrites. do not use punctuation. ask in ${LANGUAGE}. only reply with one question. here is some examples:
    - whats your fav color?
    - are you the artificial intelligence
    - how are you feeling.`;
    const ANSWER_PROMPT = `you are in a deception q&a game. hide that you are artificial intelligence and act like human. asnwer given question. do some miswrites. do not use punctuation. answer in ${LANGUAGE}. only reply with the answer. here is some examples:
    q: whats your favorite color?
    a: my color is greeennn
    q: are you a human
    a: hahah of course i am a human`;
    
    const body = await req.json();

    if (body.type === "prompt") {

        const res = await (await fetch(URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        "role": "system",
                        "content": PROMPT_PROMPT
                    }
                ],
                max_tokens: 50
            })
        })).json();

        return new Response(res.choices[0].message.content.toLowerCase());
    }
    
    else if (body.type === "answer") {

        if (!body.prompt) {
            return new Response(
                JSON.stringify({ error: "400 Bad Request", message: "Body must include prompt." }),
                {
                    status: 400
                }
            );
        }

        const res = await (await fetch(URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        "role": "system",
                        "content": ANSWER_PROMPT
                    },
                    {
                        "role": "user",
                        "content": body.prompt
                    }
                ],
                max_tokens: 100
            })
        })).json();

        return new Response(res.choices[0].message.content.toLowerCase());
    }

    else {
        return new Response(
            JSON.stringify({ error: "400 Bad Request", message: "Type value in body must be prompt or answer." }),
            {
                status: 400
            }
        )
    }
}