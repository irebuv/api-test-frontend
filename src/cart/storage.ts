const STORAGE_KEY = "cart:v1";

export function getStorage(): Storage | null {
    if (typeof window === "undefined") return null;
    try {
        const k = "__t__";
        localStorage.setItem(k, "1");
        localStorage.removeItem(k);
        return localStorage;
    } catch {
        return null;
    }
}

export function loadCart<T>(fallback: T): T {
    const storage = getStorage();
    if (!storage) return fallback;
    try {
        const raw = storage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function saveCart<T>(state: T){
    const storage = getStorage();
    if (!storage) return;
    try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        //
    }
}