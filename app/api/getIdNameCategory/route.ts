// app/api/sheets/route.ts
import { getSheetNamesWithJ2Values } from '@/lib/getIdNameCategory';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const id = process.env.NEXT_PUBLIC_GOOGLESHEETS_ID!;
        const data = await getSheetNamesWithJ2Values(id);
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
