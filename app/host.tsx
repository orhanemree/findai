"use client"

import { useState, useEffect } from "react";
import firebase from "@/utils/firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { UserSchema, RoomSchema } from "@/types";

import ButtonPrimary from "@/components/ButtonPrimary";

interface Props {
    room: RoomSchema,
    roomId: string,
    userId: string
}

// initialize firebase rt database
firebase();
const db = getDatabase();


export default ({ room, roomId, userId }: Props) => {

    const [room_, setRoom] = useState<RoomSchema>(room);
    const [currPrompt, setCurrPrompt] = useState<number>(0);

    const relativeDBPath = `findai/rooms/${roomId}`;

    // listen firebase realtime database and update room_ data
    useEffect(() => {
        onValue(ref(db, relativeDBPath), (snapshot: any) => {
            const data = snapshot.val() as RoomSchema;
            setRoom(data);
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
    
            const prompt = room_.users.map(u => u.prompt)[currPrompt];
            // update current prompt in database so player can see
            await set(ref(db,`${relativeDBPath}/prompt`), prompt);
    
            setCurrPrompt(currPrompt+1);
        } else {
            // start voting
            await set(ref(db,`${relativeDBPath}/voting`), true);
        }
    }

    return (
        <>
            <div>Room:{roomId}</div>
            {room_.users.map(u => (
                <>
                    <div>
                        <div style={{backgroundColor: u.displayColor!, width: "min-content"}}>
                            {u.role}-{u.userId}
                        </div>
                        {room_.started && 
                            <>
                                {room_.voting ?
                                    <div>Vote: {u.votedFor}</div>
                                :
                                    <div>Answer: {u.answer}</div>
                                }
                            </>
                        }
                    </div>
                </>
            ))}
            {room_.started ?
                <>
                    {!room_.voting  &&
                        // if players answered
                        <ButtonPrimary onClick={next} disabled={
                            !(room_.users.filter(u => u.answer === "").length === 0)
                        }>{currPrompt+1 === room_.population ? "Voting" : "Next"}</ButtonPrimary>
                    }
                </>
            :
                // if ready to start
                <ButtonPrimary onClick={start} disabled={
                    !(room_.population === room_.size && room_.users.filter(u => u.ready && u.prompt).length === room_.size)
                }>Start</ButtonPrimary>
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