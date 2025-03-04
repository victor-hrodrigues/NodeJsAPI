export interface ValidateOtpEmail {
	username: string
	otp: number
	hash: string
	expiration: number
}
