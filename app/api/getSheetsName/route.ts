

import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// get sheets TITLE
export async function GET() {
    try {
        const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLESHEETS_ID;


        const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_ENCODED;

        if (typeof encoded !== 'string') {
            throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_ENCODED must be defined in .env');
        }

        const keyFile = JSON.parse(Buffer.from(encoded, 'base64').toString())
        keyFile.private_key = keyFile.private_key.replace(/\\n/g, '\n')

        const auth = new google.auth.GoogleAuth({
            credentials: keyFile,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.get({
            spreadsheetId,
            fields: 'sheets.properties.title',
        });

        const sheetTitles = response.data.sheets?.map(sheet => sheet.properties?.title).filter(Boolean);

       

        if (!sheetTitles || sheetTitles.length === 0) {
            return NextResponse.json({ error: 'No sheets found in the spreadsheet' }, { status: 404 });
        }

        return NextResponse.json({ sheets: sheetTitles });
    } catch (error) {
        console.error('Error in getSheetsName:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
