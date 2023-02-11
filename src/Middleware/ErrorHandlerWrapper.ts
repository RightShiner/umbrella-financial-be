import { Context } from "../Context";

export async function handleApiError(context: Context, cb: (context: Context) => Promise<void>) {
    try {
        await cb(context);
    } catch (error: any) {
        context.response.json({
            "message": error.message,
            "status": "error"
        });
        context.response.writeHead(400, error.message);
        context.response.end();
    }
}