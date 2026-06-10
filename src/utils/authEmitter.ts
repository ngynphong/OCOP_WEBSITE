type AuthListener = () => void;

class AuthEmitter {
  private listeners: AuthListener[] = [];

  subscribe(listener: AuthListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(event: 'UNAUTHORIZED') {
    if (event === 'UNAUTHORIZED') {
      this.listeners.forEach((listener) => listener());
    }
  }
}

export const authEmitter = new AuthEmitter();
