"use client";

import { useEffect, useState } from "react";
import { InterfaceItem } from "@/database/db";
import { useTranslations } from "next-intl";

export default function InterfaceList() {
    const t = useTranslations();

    const [items, setItems] = useState<InterfaceItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/interfaces", { method: "GET" });
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setItems(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col space-y-5">
            {items.map((item) => (
                <div className="card bg-base-100 w-[600px] max-w-full shadow-md">
                    <div className="card-body">

                        <div className="flex justify-between">

                            <div>
                                <div className="font-medium card-title">{item.interface_name}</div>

                                <div className="text-sm text-gray-500">{item.ip_address}</div>
                                {/*
                                {downloadSpeed && (
                                    <div className="text-xs text-gray-400">
                                        ⬇ {downloadSpeed} ⬆ {uploadSpeed} ・ {lastSeen}
                                    </div>
                                )}
                                */}

                            </div>

                            <div className="flex items-center space-x-2">

                                <div className="pr-4">Expire time</div>

                                <button
                                    onClick={() => { }}
                                    className="btn btn-square btn-md"
                                    title="QRコード"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => { }}
                                    className="btn btn-square btn-md"
                                    title="ダウンロード"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => { }}
                                    className="btn btn-square btn-md"
                                    title="削除"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>

                        </div>

                        {/*
                        <QRCodeModal
                            visible={qrVisible}
                            onClose={() => setQrVisible(false)}
                            configText={`[Peer]\nPublicKey = xxxxxx\nAllowedIPs = ${ip}/32\nEndpoint = your.server:51820`}
                        />
                        */}

                    </div>
                </div>
            ))}
        </div>
    );
};
