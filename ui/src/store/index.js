import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useLoading = create(set => ({
  show: false,
  setLoading: value => {
    if (value === true) set({ show: value });
    else setTimeout(() => set({ show: false }), 100);
  },
}));

export const useSetting = create(
  persist(
    set => ({
      mode: 'light',
      grid: true,
      timeout: 30000,
      toggle: false,
      setMode: value => set({ mode: value }),
      setGrid: value => set({ grid: value }),
      setTimeout: value =>
        set({
          timeout:
            value === 0 || isNaN(value)
              ? 30 * 1000
              : parseInt(value, 10) * 1000,
        }),
      setToggle: value => set({ toggle: value }),
    }),
    {
      name: 'userPreference',
      getStorage: () => sessionStorage,
    }
  )
);

export const useProcess = create(set => ({
  list: [],
  content: null,
  setList: value => set({ list: value }),
  setContent: value => set({ content: value }),
}));

export const useAlert = create(set => ({
  text: null,
  type: 'info',
  setAlert: ({ text = 'Internal Server Error', type }) => {
    set({ text, type });
  },
}));
