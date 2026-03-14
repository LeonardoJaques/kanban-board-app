
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiClient = {
  async getBoards() {
    const resp = await fetch(`${BASE_URL}/boards`);
    if (!resp.ok) throw new Error('Failed to fetch boards');
    return resp.json();
  },

  async getAll() {
    const resp = await fetch(`${BASE_URL}/all`);
    if (!resp.ok) throw new Error('Failed to fetch all data');
    return resp.json();
  },

  async getBoard(id: string) {
    const resp = await fetch(`${BASE_URL}/boards/${id}`);
    if (!resp.ok) throw new Error('Failed to fetch board');
    const b = await resp.json();
    return { ...b.data, _id: b.id, name: b.name };
  },

  async saveBoard(board: any) {
    const resp = await fetch(`${BASE_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(board),
    });
    if (!resp.ok) throw new Error('Failed to save board');
    return resp.json();
  },

  async deleteBoard(id: string) {
    const resp = await fetch(`${BASE_URL}/boards/${id}`, {
      method: 'DELETE',
    });
    if (!resp.ok) throw new Error('Failed to delete board');
    return resp.json();
  },

  async getRecords(boardId: string) {
    const resp = await fetch(`${BASE_URL}/records/${boardId}`);
    if (!resp.ok) throw new Error('Failed to fetch records');
    return resp.json();
  },

  async saveRecord(record: any) {
    const resp = await fetch(`${BASE_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!resp.ok) throw new Error('Failed to save record');
    return resp.json();
  },

  async deleteRecord(id: string) {
    const resp = await fetch(`${BASE_URL}/records/${id}`, {
      method: 'DELETE',
    });
    if (!resp.ok) throw new Error('Failed to delete record');
    return resp.json();
  }
};
