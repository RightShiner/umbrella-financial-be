import { Context } from "../Context";
export default function handleBase64QueryParameters(context: Context) {
    if (typeof context.request.query.base64Encoded === "string") {
        const buffer = Buffer.from(context.request.query.base64Encoded, "base64");
        const text = buffer.toString("ascii");
        const json = JSON.parse(text);

        context.request.query = json;
    }
}