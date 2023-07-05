import { cookies } from "next/headers";
import initializeFirebase from "@/utils/firebase";
import { getDatabase, ref, get, child } from "firebase/database";
import { RoomSchema, UserSchema } from "@/types";

import Home from "./home";
import Host from "./host";
import Player from "./player";

initializeFirebase();
const db = getDatabase();

export default async () => {

    const cookie = cookies();
    const roomId = cookie.get("room-id")?.value ?? "";
    const userId = cookie.get("user-id")?.value ?? "";

    let room: RoomSchema;
    let users: Array<UserSchema>;
    let isRoom: boolean = false;
    let role: string = "player";

    if (roomId && userId) {

        // check if room is valid
        const snapshot = await get(child(ref(db), `findai/rooms/${roomId}`));
        if (snapshot.exists()) {
            
            room = snapshot.val();

            // check if user is the host
            if (room.hostId === userId) {
                isRoom = true;
                role = "host";

            } else {
                // not host

                // check if user id is valid and player int he room
                users = room.users;
                const keys = Object.keys(users);
                const user = keys.filter((k: any) => users[k].userId === userId).map((k: any) => users[k]);
        
                if (user.length >= 1) {
                    isRoom = true;
                } else {
                    // room is not valid
                }
            }

        }
    }

    return (
        <>
            {isRoom ? (
                <>
                    {(role === "host") ? (
                        <Host room={room!} roomId={roomId} userId={userId}></Host>
                    ) : (
                        <Player room={room!} roomId={roomId} userId={userId}></Player>
                    )}
                </>
            ) : (
                <Home />
            )}
        </>
    )
}
