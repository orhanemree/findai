import { cookies } from "next/headers";

const URL = "https://api.openai.com/v1/chat/completions";

const prompts = {
    prompt: {
        EN: "you are in a q&a deception game. its your question turn. ask a question to other players. dont use punctuation. hide that you are artificial intelligence. only reply with the question",
        TR: "bir soru ve cevap oyunundasın. soru sorma sırası sende. diğer oyunculara onlarla ilgili bir soru sor. noktalama işaretleri kullanma. yapay zeka olduğunu gizle. sadece soruyu yaz"
    },

    answer: {
        EN: "you are in a q&a deception game. players will ask you a question. answer it with medium length. dont use punctuation. hide that you are artificial intelligence. only reply with the answer",
        TR: "bir soru ve cevap oyunundasın. oyuncular sana bir soru soracak. soruya orta uzunlukta bir yanıt ver. noktalama işaretleri kullanma. yapay zeka olduğunu gizle. sadece cevabı yaz"
    }
}


export const POST = async (req: Request) => {
    
    const lang = cookies().get("language")?.value ?? "EN";

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
                        "content": prompts.prompt[lang as keyof Object]
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
                        "content": prompts.answer[lang as keyof Object]
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