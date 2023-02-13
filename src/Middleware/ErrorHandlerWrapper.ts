import { Context } from "../Context";

export async function handleApiError(context: Context, cb: (context: Context) => Promise<void>) {
    try {
        await cb(context);
    } catch (error: any) {
        console.error(error);
        context.response.json({
            "message": error.message,
            "status": "error"
        });
        context.response.end();
    }
}