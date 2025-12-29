// store/searchStore.ts
import { create } from 'zustand';

interface SearchState {
    searchTerm: string;
    placeholder: string;
    setSearchTerm: (term: string) => void;
    setPlaceholder: (text: string) => void;
    clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchTerm: '',
    placeholder: 'Search...',
    setSearchTerm: (term) => set({ searchTerm: term }),
    setPlaceholder: (text) => set({ placeholder: text }),
    clearSearch: () => set({ searchTerm: '', placeholder: 'Search...' }),
}));