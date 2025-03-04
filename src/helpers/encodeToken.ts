export function encodeToken(token: string): string {
    return Buffer.from(`${token}:`).toString('base64');
}