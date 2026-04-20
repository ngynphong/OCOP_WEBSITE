type Listener = (isLoading: boolean, message: string) => void;

class LoadingEmitter {
  private activeRequests = 0;
  private listeners: Listener[] = [];
  private timeoutId: NodeJS.Timeout | null = null;
  private currentMessage: string = 'Đang xử lý...';

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  update(delta: number, message?: string) {
    this.activeRequests = Math.max(0, this.activeRequests + delta);
    if (message) this.currentMessage = message;

    if (this.timeoutId) clearTimeout(this.timeoutId);

    if (this.activeRequests === 0) {
      // Use a small timeout to batch requests and prevent flickering
      this.timeoutId = setTimeout(() => {
        if (this.activeRequests === 0) {
          this.notify(false);
          this.currentMessage = 'Đang xử lý...'; // Reset to default
        }
      }, 50);
    } else {
      this.notify(true, this.currentMessage);
    }
  }

  private notify(isLoading: boolean, message?: string) {
    this.listeners.forEach((listener) => listener(isLoading, message || this.currentMessage));
  }
}

export const globalLoading = new LoadingEmitter();
