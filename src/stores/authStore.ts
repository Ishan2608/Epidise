import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

export type Role = 'doctor' | 'patient';
export type KYCStatus = 'not_started' | 'pending' | 'verified' | 'manual_review' | 'failed';

export interface DoctorStatus {
  kycStatus: KYCStatus;
  profileCompleted: boolean;
  isActive: boolean;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  role: Role | null;
  doctorStatus: DoctorStatus | null;
  loading: boolean;
  initialized: boolean;
  init: () => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

async function loadUserContext(session: Session | null): Promise<{ role: Role | null; doctorStatus: DoctorStatus | null }> {
  if (!session?.user) {
    return { role: null, doctorStatus: null };
  }

  const userId = session.user.id;

  const { data: userRow, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (userError || !userRow) {
    return { role: null, doctorStatus: null };
  }

  const role = userRow.role as Role;

  if (role !== 'doctor') {
    return { role, doctorStatus: null };
  }

  const { data: doctorRow, error: doctorError } = await supabase
    .from('doctors')
    .select('kyc_status, profile_completed, is_active')
    .eq('user_id', userId)
    .single();

  if (doctorError || !doctorRow) {
    return { role, doctorStatus: null };
  }

  return {
    role,
    doctorStatus: {
      kycStatus: doctorRow.kyc_status as KYCStatus,
      profileCompleted: doctorRow.profile_completed,
      isActive: doctorRow.is_active
    }
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  role: null,
  doctorStatus: null,
  loading: true,
  initialized: false,

  init: () => {
    if (get().initialized) return;
    set({ initialized: true });

    supabase.auth.getSession().then(async ({ data }) => {
      const context = await loadUserContext(data.session);
      set({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
        ...context
      });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      loadUserContext(session).then(context => {
        set({
          session,
          user: session?.user ?? null,
          loading: false,
          ...context
        });
      });
    });
  },

  refresh: async () => {
    set({ loading: true });
    const { data } = await supabase.auth.getSession();
    const context = await loadUserContext(data.session);
    set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
      ...context
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, role: null, doctorStatus: null });
  }
}));
