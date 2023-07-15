"use client";

import { useContext, useState } from "react";
import { Context } from "@/context/Context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import ButtonPrimary from "@/components/ButtonPrimary";
import Warning from "@/components/Warning";
import Description from "@/components/Description";
import Form from "@/components/form";
import InputText from "@/components/form/InputText";
import InputNumber from "@/components/form/InputNumber";


export default () => {

    const { lang } = useContext(Context) as { lang: string };

    const [progress, setProgress] = useState<number>(1);
    const [size, setSize] = useState<number>(2);
    const [sizeWarn, setSizeWarn] = useState<string>("");
    const [adminToken, setAdminToken] = useState<string>("");
    const [adminTokenWarn, setAdminTokenWarn] = useState<string>("");

    const { push } = useRouter();

    const sizeChange = (e: React.ChangeEvent) => {
        setSize(parseInt((e.target as HTMLInputElement).value));
    }

    const adminTokenChange = (e: React.ChangeEvent) => {
        setAdminToken((e.target as HTMLInputElement).value);
    }
    
    const next = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!(size >= 2 && size <= 10)) {
            setSizeWarn(lang !== "TR" ? "Size must be between 2 and 10."
                : "Oda boyutu 2 ile 10 arasında olmalıdır.");
            return;
        }
        setProgress(progress+1);
    }

    const create = async (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: check if admin token is valid
        if (adminToken) {
            setAdminTokenWarn(lang !== "TR" ? "Token is invalid." : "Jeton geçersiz.");

        } else {
            // create new room in db
            const res = await fetch("/api/create", {
                method: "POST", body: JSON.stringify({ size: size })
            });

            if (res.status === 201) {
                push("/");

            } else {
                setAdminTokenWarn((await res.json()).message);
            }
        }

    }


    return (
        <div className="px-12 text-lg">
            {progress === 1 &&
                <motion.div
                    initial={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                >
                    <Form onSubmit={next}>
                        {/* ask for room size */}
                        <Description>
                            {lang !== "TR" ?
                                "Enter the size of the room between values 2-10. "
                            : 
                                "2 ile 10 arasında oda boyutu gir."
                            }
                        </Description>
                        <InputNumber label={lang !== "TR" ? "Room Size" : "Oda Boyutu"}
                            onInput={sizeChange} value={size} />
                        <ButtonPrimary type="submit" disabled={!size}>
                            {lang !== "TR" ? "Next" : "Devam"}
                        </ButtonPrimary>
                        {sizeWarn &&
                            <Warning>{sizeWarn}</Warning>
                        }
                    </Form>
                </motion.div>
            }
            {progress === 2 &&
                <motion.div
                    initial={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                >
                    <Form onSubmit={create}>
                        {/* ask for admin token */}
                        <Description>
                            {lang !== "TR" ?
                                "If you are not a admin, skip and create room as host."
                            : 
                                "Eğer bir yönetici değilsen atla ve oda sahibi olarak oluştur."
                            }
                        </Description>
                        <InputText label={lang !== "TR" ? "Admin Token" : "Yönetici Jetonu"} onInput={adminTokenChange}
                            required={false} />
                        <ButtonPrimary type="submit">
                            {!adminToken ? (lang !== "TR" ? "Skip" : "Atla")
                                : (lang !== "TR" ? "Create" : "Oluştur")}
                        </ButtonPrimary>
                        {adminTokenWarn &&
                            <Warning>{adminTokenWarn}</Warning>
                        }
                    </Form>
                </motion.div>
            }
        </div>
    )
}