type SocketCallback = (data: any) => void;

class SocketService {
  private socket: WebSocket | null = null;
  private callbacks: Set<SocketCallback> = new Set();

  connect() {
    if (this.socket) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.socket = new WebSocket(`${protocol}//${host}`);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.callbacks.forEach(cb => cb(data));
    };

    this.socket.onclose = () => {
      this.socket = null;
      setTimeout(() => this.connect(), 3000);
    };
  }

  subscribe(callback: SocketCallback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }
}

export const socketService = new SocketService();
