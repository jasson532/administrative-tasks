import type { WorkerStatus } from 'modules/shared/types/database.types';

export interface WorkerFormData {
  identification: string;
  full_name: string;
  email: string;
  birthday_day: number;
  birthday_month: number;
  address: string;
  start_date: string;
  status: WorkerStatus;
  role_id: string;
  city_id: string;
  arl_id: string;
  eps_id: string;
  blood_type_id: string;
  team_id: string;
}
