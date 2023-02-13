export function convertToDateOrNull(value: any) {
    if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) {
        return null;
    }
    try {
        return new Date(value);
    } catch { }
    return null;
}
export function convertBase64ToJsonOrNull(value: any) {
    try {
        if (typeof value !== "string") {
            throw new Error("Invalid value");
        }
        const buffer = Buffer.from(value, "base64");
        const text = buffer.toString("ascii");
        const json = JSON.parse(text);

        return json;
    } catch { }
    return null;
}