export class ApiError extends Error {
	public readonly statusCode: number

	constructor(message: string, statusCode: number) {
		super(message)
		this.statusCode = statusCode
	}
}

export class BadRequestError extends ApiError {
	constructor(message: string) {
		super(message, 400)
	}
}

export class NotFoundError extends ApiError {
	constructor(message: string) {
		super(message, 404)
	}
}

export class UnauthorizedError extends ApiError {
	constructor(message: string) {
		super(message, 401)
	}
}

export class ForbiddenError extends ApiError {
	constructor(message: string) {
		super(message, 403)
	}
}

export class InternalServerError extends ApiError {
	constructor(message: string) {
		super(message, 500)
	}
}

export class MethodNotAllowedError extends ApiError {
	constructor(message: string) {
		super(message, 405)
	}
}

export class ConflictError extends ApiError {
	constructor(message: string) {
		super(message, 409)
	}
}

export class UnprocessableEntityError extends ApiError {
	constructor(message: string) {
		super(message, 422)
	}
}

export class TooManyRequestsError extends ApiError {
	constructor(message: string) {
		super(message, 429)
	}
}
