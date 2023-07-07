"use client"

import { cookies } from "next/headers";
import { useState, useEffect } from "react";
import firebase from "@/utils/firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { RoomSchema } from "@/types";
import { Message as MsgSchema } from "@/types";

import Form from "@/components/form";
import InputText from "@/components/form/InputText";
import ButtonPrimary from "@/components/ButtonPrimary";
import Description from "@/components/Description";
import Message from "@/components/Message";
import User from "@/components/user";
import UserVote from "@/components/user/UserVote";

interface Props {
    room: RoomSchema,
    roomId: string,
    userId: string
}


// initialize firebase rt databse
firebase();
const db = getDatabase();


export default ({ room, roomId, userId }: Props) => {

    const [room_, setRoom] = useState<RoomSchema>(room);
    const [prompt, setPrompt] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [messages, setMessages] = useState<MsgSchema[]>([]);

    const relativeDBPath = `findai/rooms/${roomId}`;

    useEffect(() => {
        // listen database for realtime updates
        onValue(ref(db, relativeDBPath), (snapshot: any) => {
            const data = snapshot.val() as RoomSchema;
            setRoom(data);
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

    const promptChange = (e: React.ChangeEvent) => {
        setPrompt((e.target as HTMLInputElement).value);
    }

    // send ready data to db
    const ready = async (e: React.FormEvent) => {
        e.preventDefault();
        await set(ref(db, `${userPath}/ready`), true);
        await set(ref(db, `${userPath}/prompt`), prompt);
        setPrompt("");
    }

    const answerChange = (e: React.ChangeEvent) => {
        setAnswer((e.target as HTMLInputElement).value);
    }
    
    const userIndex = room_.users.map(u => u.userId).indexOf(userId);
    const userPath = `${relativeDBPath}/users/${userIndex}`;

    const sendAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        await set(ref(db, `${userPath}/answer`), answer);
        setAnswer("");
    }

    const voted = async (uid: string) => {
        await set(ref(db, `${userPath}/votedFor`), uid);
    }

    return (
        <>
            {!room_.users[userIndex].ready ?
                <div className="px-12 text-lg">
                    {/* ask for prompt */}
                    <Form onSubmit={ready}>
                        <Description>
                            Each player will ask a prompt to everyone. Enter your prompt here.
                        </Description>
                        <InputText label="Prompt" onInput={promptChange}></InputText>
                        <ButtonPrimary type="submit" disabled={!prompt}>Ready</ButtonPrimary>
                    </Form>
                </div>
            :
                <div className="grid px-12">
                    {room_.started ? 
                        <>
                            <div className="py-12 max-w-[500px] min-h-screen grid grid-rows-[min,1fr,auto]">
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
                                {room_.voting ?
                                    <>
                                        {!room_.gotMostVote ?
                                            <UserVote room={room_} voted={voted}
                                            user={room_.users[userIndex]}></UserVote>

                                       :
                                            <div className="grid gap-2">
                                                <Description>Voting End</Description>
                                                <div className="grid grid-cols-[1fr,auto]">
                                                    <div className="flex items-center">You voted for: </div>
                                                    <User user={
                                                       room_.users[room_.users.map(u => u.userId).indexOf(room_.users[userIndex].votedFor)]
                                                    } showRole={true}></User>
                                                </div>
                                                <div className="grid grid-cols-[1fr,auto]">
                                                    <div className="flex items-center">Majority voted for: </div>
                                                    <User user={
                                                       room_.users[room_.users.map(u => u.userId).indexOf(room_.gotMostVote)]
                                                    } showRole={true}></User>
                                                </div>
                                                <div className="grid grid-cols-[1fr,auto]">
                                                    <div className="flex items-center">The AI was: </div>
                                                    <User user={
                                                       room_.users[0]
                                                    } showRole={true}></User>
                                                </div>
                                                <div className="mt-5 text-xl text-emerald-900 text-center">
                                                    {room_.playersWon ? "Players found the AI! Congrats!" : "Players couldn't find the AI."}
                                                    <a href="/join">You can play again.</a>
                                                </div>
                                            </div>
                                        }
                                    </>
                                : 
                                    <Form onSubmit={sendAnswer}>
                                        {/* ask for answer */}
                                        <div className="flex items-end justify-center gap-2">
                                            <InputText label="Answer" value={answer} onInput={answerChange}></InputText>
                                            <ButtonPrimary type="submit" disabled={room_.users[userIndex].answer !== ""}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960"><path d="M120-160v-640l760 320-760 320Zm60-93 544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z"/></svg>
                                            </ButtonPrimary>
                                        </div>
                                    </Form>
                                }
                            </div>
                        </>
                    :
                        <Description>
                            Waiting for the game start.
                        </Description>
                    }
                </div>
            }
        </>
    )
}