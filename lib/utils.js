// Local Storage Manager
export class StorageManager {
  static setItem(key, value) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static getItem(key) {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  static removeItem(key) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}

// Session Manager
export class SessionManager {
  constructor() {
    this.sessions = this.loadSessions();
    this.currentSessionId = null;
  }

  createSession() {
    const sessionId = 'session_' + Date.now();
    const newSession = {
      id: sessionId,
      title: 'Chat Baru',
      messages: [],
      createdAt: new Date().toISOString(),
      settings: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 150
      }
    };

    this.sessions.unshift(newSession);
    this.currentSessionId = sessionId;
    this.saveSessions();
    return newSession;
  }

  saveSession(sessionId, messages, title = null) {
    const session = this.sessions.find(s => s.id === sessionId);
    if (session) {
      session.messages = messages;
      if (title) session.title = title;
      this.saveSessions();
    }
  }

  loadSessions() {
    return StorageManager.getItem('chat_sessions') || [];
  }

  saveSessions() {
    StorageManager.setItem('chat_sessions', this.sessions);
  }

  deleteSession(sessionId) {
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    this.saveSessions();
  }

  clearAllSessions() {
    this.sessions = [];
    this.currentSessionId = null;
    StorageManager.removeItem('chat_sessions');
  }
}

// Format utilities
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text, maxLength = 50) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
