import type { Response } from "express";
export const handleUnexpectedError = (res: Response, error: unknown) => {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: `Internal Server Error`, error: `${error}` });
}