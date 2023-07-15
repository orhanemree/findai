import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import initializeFirebase from "@/utils/firebase";
import { getDatabase, ref, get, child, set } from "firebase/database";

// initialize firebase rt database
initializeFirebase();
const db = getDatabase();


// check if room is available. if it is, return current data of room. if not, return error
const checkRoom = async (roomId: string) => {
    
    const lang = cookies().get("language")?.value ?? "EN";

    const snapshot = await get(child(ref(db), `findai/rooms/${roomId}`))
    
    // check if the room exists
    if (!snapshot.exists()) {
        return new Response(
            JSON.stringify({
                error: "404 Not Found",
                message: lang !== "TR" ? "Room not found."
                    : "Oda bulunamadı."
            }),
            {
                status: 404
            }
        )
    }

    const data = snapshot.val();
    
    // check if the room is not full of players
    if (data.size <= data.population) {
        return new Response(
            JSON.stringify({
                error: "409 Conflict",
                message: lang !== "TR" ? "Room is full of players."
                    : "Oda dolu."
            }),
            {
                status: 409
            }
        )
    }

    return data;
}


export const POST = async (req: Request) => {

    const lang = cookies().get("language")?.value ?? "EN";

    const body = await req.json();

    if (body.type === "check") {

        if (!body.roomId) {
            return new Response(
                JSON.stringify({
                    error: "400 Bad Request",
                    message: lang !== "TR" ? "Body must contain roomId."
                        : "Body roomId içermelidir."
                }),
                {
                    status: 400
                }
            )
        }

        const data = await checkRoom(body.roomId);
        // if room is not available and function returned eror status
        if (data instanceof Response) return data;

        return new Response(
            JSON.stringify({ message: "Room is available." })
        );
    }
    
    else if (body.type === "record") {

        if (!body.roomId || !body.displayColor) {
            return new Response(
                JSON.stringify({
                    error: "400 Bad Request",
                    message: lang !== "TR" ? "Body must contain roomId and displayColor."
                        : "Body roomId ve displayColor içermelidir."
                }),
                {
                    status: 400
                }
            )
        }

        const data = await checkRoom(body.roomId);
        // if room is not available and function returned eror status
        if (data instanceof Response) return data;

        try {
            const userId = randomUUID();
            
            // push new player to database
            await set(ref(db,`findai/rooms/${body.roomId}/users/${data.population}`), {
                role: "player",
                userId: userId,
                displayColor: body.displayColor,
                ready: false,
                prompt: "",
                answer: "",
                votedFor: ""
            });

            // update room population
            await set(ref(db,`findai/rooms/${body.roomId}/population`), data.population+1);
    
            const date = new Date();
    
            // set cookie for room id expires 1 day after
            cookies().set({
                name: "room-id",
                value: body.roomId,
                expires: date.setDate(date.getDate()+1)
            });
    
            // set cookie for user id expires 1 day after
            cookies().set({
                name: "user-id",
                value: userId,
                expires: date
            });
    
            return new Response(
                JSON.stringify({ message: "Joined room successfully." }),
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

    else {
        return new Response(
            JSON.stringify({
                error: "400 Bad Request",
                message: lang !== "TR" ? "Type value in body must be check or record."
                    : "Type değeri check ya da record olmalıdır."
            }),
            {
                status: 400
            }
        )
    }
}
