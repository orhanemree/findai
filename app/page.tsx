import { cookies } from "next/headers";
import firebase from "@/utils/firebase";
import { getDatabase, ref, get, child } from "firebase/database";
import { RoomSchema, UserSchema } from "@/types";

import Home from "./home";
import Host from "./host";
import Player from "./player";

// initialize firebase realtime db
firebase();
const db = getDatabase();

export default async () => {
    
    const roomId = cookies().get("room-id")?.value ?? "";
    const userId = cookies().get("user-id")?.value ?? "";

    if (roomId && userId) {

        // check if room is valid
        const snapshot = await get(child(ref(db), `findai/rooms/${roomId}`));
        if (snapshot.exists()) {
            
            const room = snapshot.val();

            // check if user is the host
            if (room.hostId === userId) {
                // host
                return <Host room={room} roomId={roomId} userId={userId} />
            }

            // not host

            // check if user is a player in the room
            const users = room.users;
            const keys = Object.keys(users);
            const user = keys.filter((k: any) => users[k].userId === userId).map((k: any) => users[k]);
    
            if (user.length >= 1) {
                // player in the room
                return <Player room={room!} roomId={roomId} userId={userId} />
            }

            // not player
        }
    }

    return <Home />
}
