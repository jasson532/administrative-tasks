import { supabase } from 'modules/shared/services/supabase/supabaseClient';
import type { Worker } from 'modules/shared/types/database.types';
import type { WorkerFormData } from '../types/workers.types';

const WORKER_SELECT = `
  *,
  role:adl_roles(*),
  city:adl_cities(*),
  arl:adl_arls(*),
  eps:adl_eps(*),
  blood_type:adl_blood_types(*),
  team:adl_teams(*, dependencia:adl_dependencias(*))
`;

export const workersService = {
  async getAll(): Promise<Worker[]> {
    const { data, error } = await supabase
      .from('adl_workers')
      .select(WORKER_SELECT)
      .order('full_name');

    if (error) throw error;
    return data as Worker[];
  },

  async getById(id: string): Promise<Worker> {
    const { data, error } = await supabase
      .from('adl_workers')
      .select(WORKER_SELECT)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Worker;
  },

  async create(worker: WorkerFormData): Promise<Worker> {
    const { data, error } = await supabase
      .from('adl_workers')
      .insert(worker)
      .select(WORKER_SELECT)
      .single();

    if (error) throw error;
    return data as Worker;
  },

  async update(id: string, worker: Partial<WorkerFormData>): Promise<Worker> {
    const { data, error } = await supabase
      .from('adl_workers')
      .update(worker)
      .eq('id', id)
      .select(WORKER_SELECT)
      .single();

    if (error) throw error;
    return data as Worker;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('adl_workers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
