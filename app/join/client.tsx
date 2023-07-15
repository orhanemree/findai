"use client";

import { useContext, useState } from "react";
import { Context } from "@/context/Context";
import { useRouter } from "next/navigation";

import Form from "@/components/form";
import Description from "@/components/Description";
import InputText from "@/components/form/InputText";
import InputColor from "@/components/form/InputColor";
import ButtonPrimary from "@/components/ButtonPrimary";
import Warning from "@/components/Warning";


export default () => {

    const { lang } = useContext(Context) as { lang: string };

    const [progress, setProgress] = useState<number>(1);
    const [roomId, setRoomId] = useState<string>("");
    const [roomIdWarn, setRoomIdWarn] = useState<string>("");
    const [displayColor, setDisplayColor] = useState<string>("#000000");
    const [displayColorWarn, setDisplayColorWarn] = useState<string>("");

    const { push } = useRouter();

    const roomIdChange = (e: React.ChangeEvent) => {
        setRoomId((e.target as HTMLInputElement).value);
    }

    const displayColorChange = (e: React.ChangeEvent) => {
        setDisplayColor((e.target as HTMLInputElement).value);
    }
    
    const next = async (e: React.FormEvent) => {
        e.preventDefault();

        if (roomId.length !== 6) {
            setRoomIdWarn(lang !== "TR" ? "Room ID must contain 6 chars."
                : "Oda ID 6 karakter içermelidir.");
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
            method: "POST", body: JSON.stringify({
                roomId: roomId,
                displayColor: displayColor,
                type: "record"
            })
        });
        
        if (res.status === 201) {
            push("/");
            
        } else {
            setDisplayColorWarn((await res.json()).message);
        }
    }


    // ask for room id
    if (progress === 1) {
        return (
            <div className="px-12 text-lg">
                <Form onSubmit={next}>
                    <Description>
                    {lang !== "TR" ? 
                        <>Enter the room ID the host gave you. If you are the host,&nbsp;
                        <a href="/create">create</a> new room.</>
                    :
                        <>Oda sahibinin verdiği oda ID gir. Eğer oda sahibi sensen yeni oda&nbsp;
                        <a href="/create">oluştur</a>.</>
                    }
                    </Description>
                    <InputText label={lang !== "TR" ? "Room ID" : "Oda ID"} onInput={roomIdChange} />
                    <ButtonPrimary type="submit" disabled={!roomId}>
                    {lang !== "TR" ? "Next" : "Devam"}
                    </ButtonPrimary>
                    {roomIdWarn &&
                        <Warning>{roomIdWarn}</Warning>
                    }
                </Form>
            </div>
        )
    }


    // ask for display color
    if (progress === 2) {
        return (
            <div className="px-12 text-lg">
                <Form onSubmit={join}>
                    <Description>
                        {lang !== "TR" ? 
                            "You are anonymous here! Select a color will make you unique."
                        : 
                            "Burada anonimsin! Seni benzersiz kılacak bir renk seç."
                        }
                    </Description>
                    <InputColor label={lang !== "TR" ? "Display Color" : "Renk"}
                        onInput={displayColorChange} />
                    <ButtonPrimary type="submit" disabled={displayColor === "#000000"}>
                        {lang !== "TR" ? "Join" : "Katıl"}
                    </ButtonPrimary>
                    {displayColorWarn &&
                        <Warning>{displayColorWarn}</Warning>
                    }
                </Form>
            </div>
        )
    }
}
