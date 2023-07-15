import { cookies } from "next/headers";

const URL = "https://api.openai.com/v1/chat/completions";


export const POST = async (req: Request) => {
    
    const lang = cookies().get("language")?.value ?? "EN";
    const LANGUAGE = lang !== "TR" ? "english" : "turkish";
    const PROMPT_PROMPT = `you are in a deception q&a game. ask a question like a human to other players in the game. do some miswrites like human texts. ask in ${LANGUAGE}. only reply with the question.`;
    const ANSWER_PROMPT = `you are in a deception q&a game. hide that you are artificial intelligence. asnwer question as a human. answer in ${LANGUAGE}. only reply with the answer.`;
    
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