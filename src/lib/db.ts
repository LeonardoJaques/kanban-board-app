import PouchDB from 'pouchdb-browser';
import { apiClient } from './api';

export async function restartSync() {
    // Sync is now handled by the PostgreSQL backend
}


export async function setRemoteDb(url: string, user: string, password: string) {
    // Remote DB setting is legacy for CouchDB
}




export interface PouchDBBridge {
    allDocs(opts?: any): Promise<any>;
    get<T>(id: string, opts?: any): Promise<T>;
    put(doc: any, opts?: any): Promise<any>;
    post(doc: any, opts?: any): Promise<any>;
    remove(doc: any, opts?: any): Promise<any>;
    find(query: any): Promise<any>;
    bulkDocs(docs: any[], opts?: any): Promise<any[]>;
    destroy(opts?: any): Promise<any>;
}

export function getLocalDb(): PouchDBBridge {
    const bridge: PouchDBBridge = {
        allDocs: async (opts?: any): Promise<any> => {
             const allData = await apiClient.getAll();
             return { rows: allData.map((d: any) => ({ doc: d, id: d._id })) };
        },
        get: async <T>(id: string, opts?: any): Promise<T> => {
             return apiClient.getBoard(id) as any;
        },
        put: async (doc: any, opts?: any): Promise<any> => apiClient.saveRecord(doc),
        post: async (doc: any, opts?: any): Promise<any> => {
            if (doc.type === 'kanbanBoard') return apiClient.saveBoard(doc);
            return apiClient.saveRecord(doc);
        },
        remove: async (doc: any, opts?: any): Promise<any> => {
            if (doc.type === 'kanbanBoard') return apiClient.deleteBoard(doc._id);
            return apiClient.deleteRecord(doc._id);
        },
        find: async (query: any): Promise<any> => {
            if (query.selector.type === 'kanban') {
                const docs = await apiClient.getRecords(query.selector.boardId);
                return { docs };
            }
            return { docs: [] };
        },
        bulkDocs: async (docs: any[], opts?: any): Promise<any[]> => {
            const results = [];
            for (const doc of docs) {
                if (doc.type === 'kanbanBoard') results.push(await apiClient.saveBoard(doc));
                else results.push(await apiClient.saveRecord(doc));
            }
            return results.map(r => ({ id: r._id, ok: true }));
        },
        destroy: async (opts?: any): Promise<any> => {
            // Not really supported for Postgres integration in this simple bridge,
            // but we can mock it or clear the DB if needed.
            return { ok: true };
        }
    };
    return bridge;
}

export function getLocalConfigDb() {
    // Keep local config in PouchDB for now, or move to localStorage
    const dbBaseName = window.location.pathname.replace(/\//g, '_');
    return new PouchDB(`kanban-board-config-v1@${dbBaseName}`, { auto_compaction: true });
}

