import { NextResponse } from 'next/server';

export function noCacheResponse<JsonBody>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody> {
    const response = NextResponse.json(body, init);
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
}
