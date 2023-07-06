import { RoomSchema } from "@/types";

import User from ".";


export default ({ room }: { room: RoomSchema }) => {

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
                                            {u.votedFor ? "Voted" : "Waiting"}
                                        </div>
                                    :
                                        <div>
                                            {u.answer ? "Answered" : "Waiting"}
                                        </div>
                                    }
                                    </>
                                :
                                    <div>
                                        {u.ready ? "Ready" : "Waiting"}
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