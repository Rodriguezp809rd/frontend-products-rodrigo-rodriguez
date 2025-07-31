export interface BackendError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}
