import { NextResponse, NextRequest } from "next/server";
import db from "@/database/db";

export async function GET(req: NextRequest) {

    const userid = "testuser";

    // プレースホルダを使ってSQLを準備
    const stmt = db.prepare("SELECT * FROM interfaces WHERE userid = ?");

    // プレースホルダに値をバインド
    const interfaces = stmt.all(userid);

    return NextResponse.json(interfaces);
}

export async function POST(req: NextRequest) {
    const { userid, interface_name, ip_address } = await req.json();

    // プレースホルダを使ってSQLを準備
    const stmt = db.prepare("INSERT INTO interfaces (userid, interface_name, ip_address) VALUES (?, ?, ?)");

    // プレースホルダに値をバインド
    stmt.run(userid, interface_name, ip_address);

    return NextResponse.json({ message: "Client created successfully" });
}