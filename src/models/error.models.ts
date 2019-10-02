export interface IError {
  readonly message: string;
  readonly status: number;
}

export const error = (options: Partial<IError> = {}): IError => ({
  message: options.message || "An error has occurred",
  status: options.status || 500
});
