"use client"

import { useState, useEffect } from "react";
import firebase from "@/utils/firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { UserSchema, RoomSchema } from "@/types";

import Form from "@/components/form";
import InputText from "@/components/form/InputText";
import ButtonPrimary from "@/components/ButtonPrimary";

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
    const [prompt, setPrompt] = useState("");
    const [answer, setAnswer] = useState("");

    const relativeDBPath = `findai/rooms/${roomId}`;

    useEffect(() => {
        // listen database for realtime updates
        onValue(ref(db, relativeDBPath), (snapshot: any) => {
            const data = snapshot.val() as RoomSchema;
            setRoom(data);
        })
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

    return (
        <>
            <div>Room Id: {roomId}</div>
            {room_.started ? 
                <>
                    {room_.voting ?
                        <>
                            <div>Voting started</div>
                        </>
                    : 
                        <>
                            <div>{room_.prompt}</div>
                            <Form onSubmit={sendAnswer}>
                                <InputText label="Answer" onInput={answerChange}></InputText>
                                <ButtonPrimary type="submit" disabled={!answer}>Send</ButtonPrimary>
                            </Form>
                        </>
                    }
                </>
            :
                <>
                    <Form onSubmit={ready}>
                        <InputText label="Prompt" onInput={promptChange}></InputText>
                        <ButtonPrimary type="submit" disabled={!prompt}>Ready</ButtonPrimary>
                    </Form>
                </>
            }
            <br />
            <div>
                <pre>
                    {JSON.stringify(room_, null, 2)}
                </pre>
            </div>
        </>
    )
}