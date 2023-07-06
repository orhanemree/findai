"use client"

import { useState, useEffect } from "react";
import firebase from "@/utils/firebase";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { UserSchema, RoomSchema } from "@/types";

import ButtonPrimary from "@/components/ButtonPrimary";
import User from "@/components/user";
import UserDetailed from "@/components/user/UserDetailed";

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

    const randomSortKey = Math.floor(Math.random() * (0 - 5) + 5);


    const next = async () => {
        if (currPrompt < room_.population) {
            // clear all answers from players
            for (let i = 0; i < room_.population; ++i) {
                await set(ref(db,`${relativeDBPath}/users/${i}/answer`), "");
            }
    
            const prompt = room_.users.map(u => u.prompt).sort((a, b) => a[randomSortKey].localeCompare(b[randomSortKey]))[currPrompt];
            // update current prompt in database so player can see
            await set(ref(db,`${relativeDBPath}/prompt`), prompt);
    
            setCurrPrompt(currPrompt+1);

            // send the prompt to ai and save the answer to db
            const AIanswer = AIgetAnswer(prompt);
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
        interface UserResult {
            userId: string,
            votedFor: string,
            votes: number
        }

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


    // ai functions
    const AIgetAnswer = (prompt: string) => {
        return `answer to prompt ${prompt}`;
    }

    const AIvote = () => {
        const userIndex = Math.floor(Math.random() * (room_.population - 1) + 1); // index of a random user
        return room_.users[userIndex].userId; // return users user id
    }

    return (
        <div className="py-12">
            <div className="absolute top-5 left-5 default p-3 bg-zinc-100 text-sm">
                Room ID: <span>{roomId}</span>
            </div>
            <UserDetailed room={room_}></UserDetailed>
            <div className="text-center mt-5">
                {room_.started ?
                    <>
                        {!room_.voting ?
                            // if players answered
                            <ButtonPrimary onClick={next} disabled={
                                !(room_.users.filter(u => u.answer === "").length === 0)
                            }>{currPrompt === room_.population ? "Voting" : "Next"}</ButtonPrimary>
                        :
                        // if players voted
                            <ButtonPrimary onClick={showResults} disabled={
                                !(room_.users.filter(u => u.votedFor === "").length === 0)
                            }>Results</ButtonPrimary>
                        }
                    </>
                :
                    // if ready to start
                    <ButtonPrimary onClick={start} disabled={
                        !(room_.population === room_.size && room_.users.filter(u => u.ready && u.prompt).length === room_.size)
                    }>Start</ButtonPrimary>
                }
            </div>
        </div>
    )
}