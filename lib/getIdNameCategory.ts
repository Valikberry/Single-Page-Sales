import { google } from 'googleapis';
import { readCache, writeCache } from '@/utils/fileCache';

async function getAuthClient() {
    const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_ENCODED!;
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const credentials = JSON.parse(decoded);
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return await auth.getClient();
}


export async function getSheetNamesWithJ2Values(spreadsheetId: string) {
       const cacheKey = `sheetCommunityNames-${spreadsheetId}`;
    const cached = await readCache<Array<{ id: string; name: string }>>(cacheKey);
    if (cached) return cached.data;

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties.title' });

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Categories!F2:G',
    });

    const rows = res.data.values || [];
    const formatted = rows.map(([id, name]) => ({ id, name }));

   await writeCache(cacheKey, formatted);
    return formatted;
}



