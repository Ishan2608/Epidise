import { create } from 'zustand';

interface ModalContent {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

interface ModalState {
  isOpen: boolean;
  content: ModalContent | null;
  open: (content: ModalContent) => void;
  openComingSoon: () => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  content: null,
  open: (content) => set({ isOpen: true, content }),
  openComingSoon: () =>
    set({
      isOpen: true,
      content: {
        title: 'Launching Soon!',
        message: 'Stay tuned for updates and exclusive offers.'
      }
    }),
  close: () => set({ isOpen: false })
}));
