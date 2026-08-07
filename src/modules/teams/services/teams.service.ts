import { supabase } from 'modules/shared/services/supabase/supabaseClient';
import type { Team } from 'modules/shared/types/database.types';
import type { TeamFormData } from '../types/teams.types';

const TEAM_SELECT = `*, dependencia:adl_dependencias(*)`;

export const teamsService = {
  async getAll(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('adl_teams')
      .select(TEAM_SELECT)
      .order('name');

    if (error) throw error;
    return data as Team[];
  },

  async create(team: TeamFormData): Promise<Team> {
    const { data, error } = await supabase
      .from('adl_teams')
      .insert(team)
      .select(TEAM_SELECT)
      .single();

    if (error) throw error;
    return data as Team;
  },

  async update(id: string, team: Partial<TeamFormData>): Promise<Team> {
    const { data, error } = await supabase
      .from('adl_teams')
      .update(team)
      .eq('id', id)
      .select(TEAM_SELECT)
      .single();

    if (error) throw error;
    return data as Team;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('adl_teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
