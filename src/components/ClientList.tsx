"use client";
import { useState } from "react";
import { ClientItem } from "./ClientItem";

export const ClientList = () => {
    const [clients, setClients] = useState([
        { name: "Emile", ip: "10.8.0.2", download: "1.72 MB/s", upload: "36.45 KB/s", lastSeen: "just now", active: true },
        { name: "Jason", ip: "10.8.0.3", active: true },
        { name: "Linus", ip: "10.8.0.4", active: false },
        { name: "Adam", ip: "10.8.0.5", active: true },
    ]);

    const toggleClient = (index: number) => {
        const newClients = [...clients];
        newClients[index].active = !newClients[index].active;
        setClients(newClients);
    };

    const deleteClient = (index: number) => {
        if (confirm("このクライアントを削除しますか？")) {
            const newClients = [...clients];
            newClients.splice(index, 1);
            setClients(newClients);
        }
    };

    return (
        <div className="flex flex-col space-y-5">
            {clients.map((client, i) => (
                <ClientItem
                    key={i}
                    name={client.name}
                    ip={client.ip}
                    downloadSpeed={client.download}
                    uploadSpeed={client.upload}
                    lastSeen={client.lastSeen}
                    active={client.active}
                    onToggle={() => toggleClient(i)}
                    onDelete={() => deleteClient(i)}
                />
            ))}
        </div>
    );
};
