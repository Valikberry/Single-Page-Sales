import { NextRequest, NextResponse } from 'next/server'
import { getAllSheetsByName } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
    try {
        const { sheetNames } = await req.json();

     

        if (!Array.isArray(sheetNames)) {
            return NextResponse.json(
                { error: "sheetNames must be an array" },
                { status: 400 }
            );
        }

        const data = await getAllSheetsByName(sheetNames);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch Google Sheets data" },
            { status: 500 }
        );
    }
}