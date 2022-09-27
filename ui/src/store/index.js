import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useLoading = create(set => ({
  show: false,
  setLoading: value => {
    if (value === true) set({ show: value });
    else setTimeout(() => set({ show: false }), 150);
  },
}));

export const useTheme = create(
  persist(
    set => ({
      mode: 'light',
      setMode: value => set({ mode: value }),
    }),
    {
      name: 'mode',
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
