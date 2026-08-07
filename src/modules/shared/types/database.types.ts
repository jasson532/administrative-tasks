export interface Role {
  id: string;
  name: string;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  created_at: string;
}

export interface Arl {
  id: string;
  name: string;
  created_at: string;
}

export interface Eps {
  id: string;
  name: string;
  created_at: string;
}

export interface BloodType {
  id: string;
  name: string;
  created_at: string;
}

export interface NewsType {
  id: string;
  name: string;
  convention: string;
  created_at: string;
}

export interface Dependencia {
  id: string;
  name: string;
  created_at: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  dependencia_id: string;
  created_at: string;
  updated_at: string;
  // Joined
  dependencia?: Dependencia;
}

export type WorkerStatus = 'active' | 'inactive';

export interface Worker {
  id: string;
  identification: string;
  full_name: string;
  email: string | null;
  birthday_day: number;
  birthday_month: number;
  address: string | null;
  start_date: string | null;
  status: WorkerStatus;
  role_id: string;
  city_id: string | null;
  arl_id: string | null;
  eps_id: string | null;
  blood_type_id: string | null;
  team_id: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  role?: Role;
  city?: City;
  arl?: Arl;
  eps?: Eps;
  blood_type?: BloodType;
  team?: Team;
}

export type NewsState = 'active' | 'completed' | 'cancelled';
export type TimeType = 'days' | 'hours' | 'minutes';

export interface News {
  id: string;
  state: NewsState;
  worker_id: string;
  news_type_id: string;
  description: string | null;
  time_type: TimeType;
  start_date: string | null;
  end_date: string | null;
  hours: number | null;
  minutes: number | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  worker?: Worker;
  news_type?: NewsType;
}
