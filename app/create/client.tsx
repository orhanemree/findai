"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ButtonPrimary from "@/components/ButtonPrimary";
import Warning from "@/components/Warning";
import Description from "@/components/Description";
import Form from "@/components/form";
import InputText from "@/components/form/InputText";
import InputNumber from "@/components/form/InputNumber";


export default () => {

    const { push } = useRouter();

    const [progress, setProgress] = useState<number>(1);
    const [size, setSize] = useState<number>(2);
    const [sizeWarn, setSizeWarn] = useState<string>("");
    const [adminToken, setAdminToken] = useState<string>("");
    const [adminTokenWarn, setAdminTokenWarn] = useState<string>("");

    const sizeChange = (e: React.ChangeEvent) => {
        setSize(parseInt((e.target as HTMLInputElement).value));
    }

    const adminTokenChange = (e: React.ChangeEvent) => {
        setAdminToken((e.target as HTMLInputElement).value);
    }
    
    const next = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!(size >= 2 && size <= 10)) {
            setSizeWarn("Size must be between 2 and 10.");
            return;
        }
        setProgress(progress+1);
    }

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: check if admin token is valid
        if (adminToken) {
            setAdminTokenWarn("Token is invalid.");

        } else {
            // create new room in db
            const res = await fetch("/api/create", {
                method: "POST", body: JSON.stringify({
                    size: size
                })
            });

            if (res.status === 201) {
                push("/");
            } else {
                setAdminTokenWarn((await res.json()).message);
            }
        }

    }


    return (
        <>
            <div className="px-12 text-lg">
                {/* ask for room size */}
                {progress === 1 &&
                    <div>
                        <Form onSubmit={next}>
                            <Description>
                                Enter the size of the room between values 2-10. 
                            </Description>
                            <InputNumber label="Room Size" onInput={sizeChange} value={size} />
                            <ButtonPrimary type="submit" disabled={!size}>
                                Next
                            </ButtonPrimary>
                            {sizeWarn &&
                                <Warning>{sizeWarn}</Warning>
                            }
                        </Form>
                    </div>
                }
                
                {/* ask for admin token if exists */}
                {progress === 2 &&
                    <div>
                        <Form onSubmit={create}>
                            <Description>
                                If you are not a admin, skip and create room as host.
                            </Description>
                            <InputText label="Admin Token" onInput={adminTokenChange} required={false} />
                            <ButtonPrimary type="submit">
                                {!adminToken ? "Skip" : "Create"}
                            </ButtonPrimary>
                            {adminTokenWarn &&
                                <Warning>{adminTokenWarn}</Warning>
                            }
                        </Form>
                    </div>
                }
            </div>
        </>
    )
}
