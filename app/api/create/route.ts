import { cookies } from "next/headers";
import initializeFirebase from "@/utils/firebase";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { randomUUID } from "crypto";

// initialize firebase rt database
initializeFirebase();
const db = getDatabase();


export const POST = async (req: Request) => {
    const body = await req.json();

    // return error if it's bad request
    if (!body.size || body.size < 2 || body.size > 10) {
        return new Response(
            JSON.stringify({ error: "400 Bad Request", message: "Body must contain size property between values 2 and 10." }),
            {
                status: 400
            }
        )
    }

    // TODO: check if admin token exists

    let roomId = (Math.random() + 1).toString(36).substring(2, 8); // random 6 chars text
    
    // make sure room id is not used before
    let exists = true;
    while (exists) {
        exists = (await get(child(ref(db), `findai/rooms/${roomId}`))).exists();

        roomId = (Math.random() + 1).toString(36).substring(2, 8);
    }

    const userId = randomUUID(); // random user id for host

    try {

        // create new room in database
        await set(ref(db, `findai/rooms/${roomId}`), {
            roomId: roomId,
            size: body.size+1,
            population: 1, // ai by default
            hostId: userId,
            prompt: "",
            voting: false,
            // TODO: ai should enter after a while
            users: { // initialize ai as first user
                "0": {
                    role: "ai",
                    userId: "--no--id--ai--",
                    displayColor: "#"+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0"), // random hex color
                    ready: false,
                    prompt: "",
                    answer: "",
                    votedFor: ""
                }
            }
        });

        const date = new Date();

        // set cookie room id expires 1 day after
        cookies().set({
            name: "room-id",
            value: roomId,
            expires: date.setDate(date.getDate()+1)
        });

        // set cookie for user id expires 1 day after
        cookies().set({
            name: "user-id",
            value: userId,
            expires: date
        });
        
        // return room id and user id if success
        return new Response(
            JSON.stringify({ message: "Room created successfully.", data: {
                roomId: roomId,
                userId: userId
            } }),
            {
                status: 201
            }
        );

    } catch (err: unknown) {

        // unknow error happened while setting the data
        return new Response(
            JSON.stringify({ error: "500 Internal Server Error", message: (err as Error).toString() }),
            { 
                status: 500
            }
        )
    }
}
