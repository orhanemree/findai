"use client";

import { useContext } from "react";
import { Context } from "@/context/Context";
import { RoomSchema } from "@/types";

import User from ".";


export default ({ room }: { room: RoomSchema }) => {

    const { lang } = useContext(Context) as { lang: string };

    return (
        <>
            <ul className="flex content-start justify-center gap-4 flex-wrap p-8">
                {room.users.map(u => (
                    <>
                        <li key={u.userId} className="grid gap-1 w-16">
                            <User user={u} showRole={true}></User>
                            <span className="text-center text-zinc-800 text-sm">
                                {room.started ?
                                    <>
                                    {room.voting ?
                                        <div>
                                            {u.votedFor ? (lang !== "TR" ? "Voted" : "Oyladı")
                                                : (lang !== "TR" ? "Waiting" : "Bekleniyor")}
                                        </div>
                                    :
                                        <div>
                                            {u.answer ? (lang !== "TR" ? "Answered" : "Yanıtladı")
                                                : (lang !== "TR" ? "Waiting" : "Bekleniyor")}
                                        </div>
                                    }
                                    </>
                                :
                                    <div>
                                        {u.ready ? (lang !== "TR" ? "Ready" : "Hazır")
                                            : (lang !== "TR" ? "Waiting" : "Bekleniyor")}
                                    </div>
                                }
                            </span>
                        </li>
                    </>
                ))}
            </ul>
        </>
    )
}