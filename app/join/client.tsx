"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import Warning from "@/components/Warning";
import Description from "@/components/Description";
import Form from "@/components/form";
import InputText from "@/components/form/InputText";
import InputColor from "@/components/form/InputColor";


export default () => {

    const { push } = useRouter();

    const [progress, setProgress] = useState<number>(1);
    const [roomId, setRoomId] = useState<string>("");
    const [roomIdWarn, setRoomIdWarn] = useState<string>("");
    const [displayColor, setDisplayColor] = useState<string>("#000000");
    const [displayColorWarn, setDisplayColorWarn] = useState<string>("");

    const roomIdChange = (e: React.ChangeEvent) => {
        setRoomId((e.target as HTMLInputElement).value);
    }

    const displayColorChange = (e: React.ChangeEvent) => {
        setDisplayColor((e.target as HTMLInputElement).value);
    }
    
    const reset = () => {
        setRoomId("");
        setRoomIdWarn("");
        setDisplayColor("#000000");
        setDisplayColorWarn("");
    }

    const back = () => {
        setProgress(progress-1);
        reset();
    }

    const next = async (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.length !== 6) {
            setRoomIdWarn("Room ID must contain 6 chars.");
            return;
        }
        // check if room is available
        const res = await fetch("/api/join", {
            method: "POST", body: JSON.stringify({ roomId: roomId, type: "check" })
        });
        if (res.status === 200) {
            setProgress(progress+1);
        } else {
            setRoomIdWarn((await res.json()).message);
        }
    }

    const join = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/join", {
            method: "POST", body: JSON.stringify({ roomId: roomId, displayColor: displayColor, type: "record" })
        });
        
        if (res.status === 201) {
            push("/");
        } else {
            setDisplayColorWarn((await res.json()).message);
        }
    }

    return (
        <>
            <div>
                <div>
                    {/* ask for room id */}
                    {progress === 1 &&
                        <Form onSubmit={next}>
                            <InputText label="Room ID" onInput={roomIdChange} />
                            <ButtonPrimary type="submit" disabled={!roomId}>
                                Next
                            </ButtonPrimary>
                            {roomIdWarn &&
                                <Warning>{roomIdWarn}</Warning>
                            }
                            <Description>
                                Enter the room ID the host gave you. If you are the host, <a href="/create">create</a> new room.
                            </Description>
                        </Form>
                    }
                </div>
                <div>
                    {/* ask for display color */}
                    {progress === 2 &&
                        <Form onSubmit={join}>
                            <InputColor label="Your Display Color" onInput={displayColorChange} />
                            <ButtonSecondary onClick={back}>
                                Back
                            </ButtonSecondary>
                            <ButtonPrimary type="submit" disabled={displayColor === "#000000"}>
                                Join
                            </ButtonPrimary>
                            {displayColorWarn &&
                                <Warning>{displayColorWarn}</Warning>
                            }
                            <Description>
                                You are anonymous here! Select a color will make you unique.
                            </Description>
                        </Form>
                    }
                </div>
            </div>
        </>
    )
}
