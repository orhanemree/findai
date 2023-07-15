import { cookies } from "next/headers";

const URL = "https://api.openai.com/v1/chat/completions";

const language = {
    EN: "english",
    TR: "turkish"
}

const examples = {
    prompt: {
        EN: `whats your fav color?
are you the artificial intelligence
how are you feeling`,

        TR: `en sevdiğin renk ne?
yapay zeka sen misin
nasıl hissediyorsun`
    },

    answer: {
        EN: `q: whats your favorite color?
a: my color is greenn
q: are you a human
a: hahah of course i am a human`,

        TR: `q: en sevdiğin renk ne?
a: yeşil
q: yapay zeka sen misin
a: hahah tabi ki yapay zka değilim`
    }
}


export const POST = async (req: Request) => {
    
    const lang = cookies().get("language")?.value ?? "EN";

    const PROMPT_PROMPT = `you are in a deception q&a game. act like human. ask a question to other players. do miswrites. ask in ${language[lang as keyof Object]}. only reply with one question. some examples: ${examples.prompt[lang as keyof Object]}`;
    const ANSWER_PROMPT = `you are in a deception q&a game. hide that you are artificial intelligence and act like human. asnwer given question. do miswrites. answer in ${language[lang as keyof Object]}. only reply with the answer. some examples:  ${examples.answer[lang as keyof Object]}`;
    
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

        const prompt: string = res.choices[0].message.content.toLowerCase();

        return new Response(prompt.substring(0, prompt.length-1));
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

        const answer: string = res.choices[0].message.content.toLowerCase();

        return new Response(answer.substring(0, answer.length-1));
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