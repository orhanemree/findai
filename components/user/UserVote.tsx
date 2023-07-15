"use client";

import { useContext, useState } from "react";
import { Context } from "@/context/Context";
import { RoomSchema, UserSchema } from "@/types";

import User from ".";
import ButtonSecondary from "../ButtonSecondary";
import Description from "../Description";


export default ({ room, user, voted }: { room: RoomSchema, user: UserSchema, voted: any }) => {

    const { lang } = useContext(Context) as { lang: string };

    const [users, setUsers] = useState<UserSchema[]>([...room.users].sort(() => 0.5 - Math.random()));

    return (
        <div>
            <ul className="flex content-start justify-center gap-4 flex-wrap p-8">
                {users.map(u => (
                    <>
                        {u.userId !== user.userId &&
                            <li key={u.userId} className="grid gap-2 w-16">
                                <User user={u}></User>
                                <span className="text-center text-zinc-800 text-sm">
                                    <ButtonSecondary onClick={() => {voted(u.userId)}} disabled={
                                        !!user.votedFor
                                    }>
                                        {lang !== "TR" ? "Vote" : "Oyla"}
                                    </ButtonSecondary>
                                </span>
                            </li>
                        }
                    </>
                ))}
            </ul>
            <div className="text-center">
                <Description>
                    {lang !== "TR" ?
                        "Vote who you think is the AI."
                    : 
                        "Kimin yapay zeka olduğunu düşünüyorsan ona oy ver."
                    }
                </Description>
            </div>
        </div>
    )
}