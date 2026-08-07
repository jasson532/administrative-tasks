import type { NewsState, TimeType } from 'modules/shared/types/database.types';

export interface NewsFormData {
  state: NewsState;
  worker_id: string;
  news_type_id: string;
  description: string;
  time_type: TimeType;
  start_date: string | null;
  end_date: string | null;
  hours: number | null;
  minutes: number | null;
}

export interface NewsFilters {
  worker_ids?: string[];
  news_type_ids?: string[];
  states?: NewsState[];
  team_ids?: string[];
  start_date?: string;
  end_date?: string;
}
