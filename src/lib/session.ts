import { redis } from "./redis";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

const SESSION_TTL = 60 * 60 * 24;

export async function createSession(userId: string, role: string, metadata: any = {}) {
    const sessionId = nanoid();
    const sessionData = JSON.stringify({ userId, role, ...metadata });

    await redis.set(`session:${sessionId}`, sessionData, "EX", SESSION_TTL);

    const cookieStore = await cookies();
    cookieStore.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: SESSION_TTL,
        path: "/",
    });

    return sessionId;
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) return null;

    const sessionData = await redis.get(`session:${sessionId}`);
    if (!sessionData) return null;

    return JSON.parse(sessionData);
}

export async function deleteSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
        await redis.del(`session:${sessionId}`);
    }

    cookieStore.delete("session_id");
}
