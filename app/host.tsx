"use client"

import { useContext, useState, useEffect } from "react";
import { Context } from "@/context/Context";
import firebase from "@/utils/firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { RoomSchema, UserResult, Message as MsgSchema } from "@/types";
import { useRouter } from "next/navigation";

import ButtonPrimary from "@/components/ButtonPrimary";
import Message from "@/components/Message";
import UserDetailed from "@/components/user/UserDetailed";

// initialize firebase rt database
firebase();
const db = getDatabase();


export default ({ room, roomId, userId }: { room: RoomSchema, roomId: string, userId: string }) => {

    const { lang } = useContext(Context) as { lang: string };

    const { push } = useRouter();

    const [room_, setRoom] = useState<RoomSchema>(room);
    const [currPrompt, setCurrPrompt] = useState<number>(0);
    const [messages, setMessages] = useState<MsgSchema[]>([]);
    const [askedPrompts, setAskedPrompts] = useState<string[]>([]);

    const relativeDBPath = `findai/rooms/${roomId}`;

    useEffect(() => {
        
        // get prompt from ai
        AIgetPrompt();
        
        // listen firebase realtime database and update room_ data
        onValue(ref(db, relativeDBPath), (snapshot: any) => {
            const data = snapshot.val() as RoomSchema;
            setRoom(data);

            // update messages
            const newMessages: MsgSchema[] = data.users
            .map(u => ({ userId: u.userId, content: u.answer, color: u.displayColor, type: "answer" } as MsgSchema))
            .filter(m => m.content !== "");

            if (data.prompt) {
                const whosePrompt = data.users.map(u => u.prompt).indexOf(data.prompt);
                newMessages.push({
                    userId: "--no--id--room--prompt--",
                    content: data.prompt,
                    color: data.users[whosePrompt].displayColor, type: "prompt"
                });
            }
            let updatedMessages = messages;
            for (const msg of newMessages) {
                const i = updatedMessages.findIndex(m => (
                    m.userId === msg.userId && m.content === msg.content && m.color === msg.color
                ));
                if (i === -1) {
                    updatedMessages.push(msg);
                }
            }
            setMessages(updatedMessages);
        });
    }, []);

    const start = async () => {
        // if ready to start
        if (room_.population === room_.size &&
            room_.users.filter(u => u.ready && u.prompt).length === room_.size) {

            await set(ref(db, `${relativeDBPath}/started`), true);

            // the game has started

            // if players answered, ignore if it's first prompt
            if (currPrompt === 0 || room_.users.filter(u => u.answer === "").length === 0) {
                next();
            }
        }
    }

    const next = async () => {
        if (currPrompt < room_.population) {
            // clear all answers from players
            for (let i = 0; i < room_.population; ++i) {
                await set(ref(db,`${relativeDBPath}/users/${i}/answer`), "");
            }

            // shuffle unasked prompts
            let prompts = room_.users.map(u => u.prompt);
            prompts.sort(() => 0.5 - Math.random());
            prompts = prompts.filter(p => !(askedPrompts.includes(p)));

            // select first prompt in shuffled array
            const prompt = prompts[0];
            setAskedPrompts([...askedPrompts, prompt]);

            // update current prompt in database so player can see
            await set(ref(db,`${relativeDBPath}/prompt`), prompt);
    
            setCurrPrompt(currPrompt+1);

            // send the prompt to ai and save the answer to db
            const AIanswer = await AIgetAnswer(prompt);
            await set(ref(db,`${relativeDBPath}/users/0/answer`), AIanswer); // first user is the ai b default

        } else {
            // start voting
            await set(ref(db,`${relativeDBPath}/voting`), true);

            // get ai's vote and save to db
            const AIvotedFor = AIvote();
            await set(ref(db,`${relativeDBPath}/users/0/votedFor`), AIvotedFor); // first user is the ai b default
        }
    }

    const showResults = async () => {
        // increment votes for each vote to user
        const users: UserResult[] = room_.users.map(u => ({ userId: u.userId, votes: 0, votedFor: u.votedFor }));
        for (const user of users) {
            const votedIndex = users.findIndex(u => u.userId === user.votedFor);
            ++users[votedIndex].votes;
        }

        const gotMostVote = users.sort((a, b) => b.votes-a.votes)[0].userId;
        const playersWon = gotMostVote === room_.users[0].userId; // is it ai

        // set results to database
        await set(ref(db,`${relativeDBPath}/gotMostVote`), gotMostVote);
        await set(ref(db,`${relativeDBPath}/playersWon`), playersWon);
    }

    const leave = async  () => {
        // reset cookies
        await fetch("/api/cookie", {
            method: "POST",
            body: JSON.stringify({ cookies: [
                {
                    name: "room-id",
                    value: "",
                    expires: new Date().getTime()
                },
                {
                    name: "user-id",
                    value: "",
                    expires: new Date().getTime()
                }
            ] })
        });
        push("/");
    }


    // ai functions

    const AIgetPrompt = async () => {

        // get prompt from ai
        const AIprompt = await ((await fetch("/api/ai", {
            method: "POST", body: JSON.stringify({ type: "prompt" })
        })).text());

        if (AIprompt) {
            // set ai prompt to db
            await set(ref(db,`${relativeDBPath}/users/0/prompt`), AIprompt);
            await set(ref(db,`${relativeDBPath}/users/0/ready`), true);
        }
    }

    const AIgetAnswer = async (prompt: string) => {
        const randomWaitTime = Math.floor(Math.random() * (20 - 14 + 1) + 14);
        await new Promise(r => setTimeout(r, randomWaitTime*1000));
        const AIanswer = await ((await fetch("/api/ai", {
            method: "POST", body: JSON.stringify({ type: "answer", prompt: prompt })
        })).text());

        return AIanswer!;
    }

    // vote a user randomly
    const AIvote = () => {
        // index of a random user
        const userIndex = Math.floor(Math.random() * (room_.population - 1) + 1);
        return room_.users[userIndex].userId; // return users user id
    }

    return (
        <div className="py-12">
            <div className="absolute top-5 left-5 default p-3 bg-zinc-100 text-sm">
                {lang !== "TR" ? "Room" : "Oda"} ID: <span>{roomId}</span>
            </div>
            <div className="px-12 max-w-[500px]">
                <ul className="flex flex-col gap-3 mb-5">
                    {messages.map((m, i) => (
                        <>
                            <li key={m.userId} className={
                                ((m.type === "prompt" && i !== 0) ? "mt-8" : "")
                            }>
                                <Message color={m.color} type={m.type}>
                                    {m.content}
                                </Message>
                            </li>
                        </>
                    ))}
                </ul>
            </div>
            <UserDetailed room={room_} />
            <div className="text-center mt-5">
                {room_.started ?
                    <>
                        {!room_.voting ?
                            // if players answered
                            <ButtonPrimary onClick={next} disabled={
                                !(room_.users.filter(u => u.answer === "").length === 0)
                            }>{currPrompt === room_.population ? (lang !== "TR" ? "Voting" : "Oylama")
                                : (lang !== "TR" ? "Next" : "Devam")}</ButtonPrimary>
                        :
                            // if players voted
                            <div className="flex items-center justify-center gap-5">
                                <ButtonPrimary onClick={showResults} disabled={
                                    (!(room_.users.filter(u => u.votedFor === "").length === 0) || !!room_.gotMostVote)
                                }>{lang !== "TR" ? "Results" : "Sonuçlar"}</ButtonPrimary>

                                <ButtonPrimary onClick={leave} disabled={!room_.gotMostVote}>
                                    {lang !== "TR" ? "Leave" : "Ayrıl"}
                                </ButtonPrimary>
                            </div>
                        }
                    </>
                :
                    // if ready to start
                    <ButtonPrimary onClick={start} disabled={
                        !(room_.population === room_.size && room_.users.filter(u => u.ready && u.prompt).length === room_.size)
                    }>{lang !== "TR" ? "Start" : "Başlat"}</ButtonPrimary>
                }
            </div>
        </div>
    )
}