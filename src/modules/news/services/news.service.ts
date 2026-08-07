import { supabase } from 'modules/shared/services/supabase/supabaseClient';
import type { News } from 'modules/shared/types/database.types';
import type { NewsFormData, NewsFilters } from '../types/news.types';

const NEWS_SELECT = `
  *,
  worker:adl_workers(*, role:adl_roles(*), team:adl_teams(*, dependencia:adl_dependencias(*))),
  news_type:adl_news_types(*)
`;

export const newsService = {
  async getAll(filters?: NewsFilters): Promise<News[]> {
    let query = supabase
      .from('adl_news')
      .select(NEWS_SELECT)
      .order('created_at', { ascending: false });

    // Server-side filters
    if (filters?.worker_ids && filters.worker_ids.length > 0) {
      query = query.in('worker_id', filters.worker_ids);
    }
    if (filters?.news_type_ids && filters.news_type_ids.length > 0) {
      query = query.in('news_type_id', filters.news_type_ids);
    }
    if (filters?.states && filters.states.length > 0) {
      query = query.in('state', filters.states);
    }
    if (filters?.start_date) {
      query = query.gte('start_date', filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte('end_date', filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;

    let results = data as News[];

    // Client-side filter: team_ids (nested relation worker→team)
    if (filters?.team_ids && filters.team_ids.length > 0) {
      results = results.filter((item) => item.worker?.team_id && filters.team_ids!.includes(item.worker.team_id));
    }

    return results;
  },

  async getById(id: string): Promise<News> {
    const { data, error } = await supabase
      .from('adl_news')
      .select(NEWS_SELECT)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as News;
  },

  async create(newsData: NewsFormData): Promise<News> {
    const { data, error } = await supabase
      .from('adl_news')
      .insert(newsData)
      .select(NEWS_SELECT)
      .single();

    if (error) throw error;
    return data as News;
  },

  async update(id: string, newsData: Partial<NewsFormData>): Promise<News> {
    const { data, error } = await supabase
      .from('adl_news')
      .update(newsData)
      .eq('id', id)
      .select(NEWS_SELECT)
      .single();

    if (error) throw error;
    return data as News;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('adl_news')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
