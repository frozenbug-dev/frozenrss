export const ErrorMessage = {
  InternalError: 'An unknown error occurred on our server. Please try again later or contact our team.',
  Forbidden: 'You are not authorized to perform this action.',
  Unauthorized: 'This request is unauthenticated. Please provide a valid session.',
  ValidationError: 'The request contains invalid fields. Please review the details section to send a correct request.',
  NotFound: 'The requested resource does not exist or was removed.',
  UploadError: 'File could not be uploaded.',
  CouldNotLoadFeed: 'Could not load the feed from the provided URL.',
  UniqueViolation: 'The resource already exists.',
} as const

export type ErrorMessageName = keyof typeof ErrorMessage
