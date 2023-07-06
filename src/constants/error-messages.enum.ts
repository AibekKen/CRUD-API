export enum ErrorMessages {
  NOT_FOUND = 'User not found',
  INVALID_ID = 'Invalid user id (not uuid)',
  BODY_REQ_FIELDS = 'Body does not contain required fields or have incorrect fields',
  BODY_INCORRECT = 'Body does not exist or incorrect format',
  ENDPOINT_DOES_NOT_EXIST ='The service endpoint requested does not exist or is not available',
  ERROR_SERVER ='Error on server side',
  ID_ON_SERVER = 'id has to generated on server side'
}