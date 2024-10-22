export class NetworkError extends Error {
  constructor(message?: string) {
    super(message || 'Network request failed');
    this.name = 'NetworkError';
  }
}
