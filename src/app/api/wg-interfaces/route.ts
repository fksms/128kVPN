import { NextResponse, NextRequest } from "next/server";
import db from "@/database/db";

// GETリクエスト
export async function GET(req: NextRequest) {

    const userid = "testuser";

    try {
        // プレースホルダを使ってSQLを準備
        const stmt = db.prepare("SELECT * FROM wg_interfaces WHERE userid = ?");

        // プレースホルダに値をバインド
        const wgInterfaces = stmt.all(userid);

        return NextResponse.json(wgInterfaces, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "SQL Error" }, { status: 500 });
    }
}

// POSTリクエスト
export async function POST(req: NextRequest) {
    const userid = "testuser";
    const ip_address = "test_ip";

    const body = await req.json();

    const name = body.name;
    const action = body.action;

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (action == "create") {
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare("INSERT INTO wg_interfaces (userid, name, ip_address) VALUES (?, ?, ?)");

            // プレースホルダに値をバインド
            stmt.run(userid, name, ip_address);

            return NextResponse.json({ message: "Interface created successfully" }, { status: 200 });
        }
        catch (error) {
            console.error(error);
            return NextResponse.json({ error: "SQL Error" }, { status: 500 });
        }
    }
    else if (action == "delete") {
        try {
            // プレースホルダを使ってSQLを準備
            const stmt = db.prepare("DELETE FROM wg_interfaces WHERE userid = ? AND name = ?");

            // プレースホルダに値をバインド
            stmt.run(userid, name);

            return NextResponse.json({ message: "Interface deleted successfully" }, { status: 200 });
        }
        catch (error) {
            console.error(error);
            return NextResponse.json({ error: "SQL Error" }, { status: 500 });
        }
    }
    else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
}