"use client";

import { useEffect, useState } from "react";
import { InterfaceItem } from "@/database/db";
import { useTranslations } from "next-intl";

export default function CreateInterfaceButton() {
    const t = useTranslations();

    return (
        <div>
            <div className="flex justify-center space-x-2">
                <button
                    className="btn btn-accent"
                    onClick={() => { (document.getElementById("create_interface_modal") as HTMLDialogElement).showModal() }}
                >+ New</button>
            </div>

            <dialog id="create_interface_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("CreateInterfaceModal.title")}</h3>
                    <p className="py-4">Press ESC key or click the button below to close</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
