import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { fetchTeams, createTeam, updateTeam, deleteTeam } from 'modules/teams/store/teamsSlice';
import { fetchAllCatalogs } from 'modules/shared/store/slices/catalogsSlice';
import { Button, Card, Input, Select, Badge, Spinner } from 'modules/shared/components/atoms';
import Modal from 'modules/shared/components/molecules/Modal/Modal';
import type { TeamFormData } from 'modules/teams/types/teams.types';
import type { SelectOption } from 'modules/shared/types/common.types';
import type { Dependencia } from 'modules/shared/types/database.types';
import './TeamsPage.scss';

const TeamsPage = () => {
  const dispatch = useAppDispatch();
  const { teams, status } = useAppSelector((state) => state.teams);
  const { dependencias } = useAppSelector((state) => state.catalogs);
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeamFormData>({ name: '', dependencia_id: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchAllCatalogs());
  }, [dispatch]);

  const dependenciaOptions: SelectOption[] = dependencias.map((d: Dependencia) => ({ value: d.id, label: d.name }));

  const openCreateModal = () => {
    setFormData({ name: '', dependencia_id: '' });
    setEditingTeam(null);
    setShowModal(true);
  };

  const openEditModal = (team: typeof teams[0]) => {
    setFormData({ name: team.name, dependencia_id: team.dependencia_id });
    setEditingTeam(team.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.dependencia_id) return;

    setSubmitting(true);
    try {
      if (editingTeam) {
        await dispatch(updateTeam({ id: editingTeam, data: formData })).unwrap();
      } else {
        await dispatch(createTeam(formData)).unwrap();
      }
      setShowModal(false);
    } catch {
      // Error handled by redux
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este equipo?')) {
      await dispatch(deleteTeam(id));
    }
  };

  if (status === 'loading' && teams.length === 0) {
    return (
      <div className="teams-page__loading">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="teams-page">
      <Card
        title="Equipos"
        subtitle={`${teams.length} registrados`}
        actions={
          <Button variant="primary" icon={<Plus size={18} />} onClick={openCreateModal}>
            Nuevo Equipo
          </Button>
        }
      >
        <div className="teams-page__grid">
          {teams.map((team) => (
            <div key={team.id} className="teams-page__card">
              <div className="teams-page__card-header">
                <h4 className="teams-page__card-name">{team.name}</h4>
                <Badge variant="primary">{team.dependencia?.name || '-'}</Badge>
              </div>
              <div className="teams-page__card-actions">
                <button className="teams-page__action-btn" onClick={() => openEditModal(team)} aria-label="Editar">
                  <Edit2 size={16} />
                </button>
                <button className="teams-page__action-btn teams-page__action-btn--danger" onClick={() => handleDelete(team.id)} aria-label="Eliminar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTeam ? 'Editar Equipo' : 'Nuevo Equipo'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="teams-page__form">
          <Input
            label="Nombre del Equipo *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Equipo Digital"
            required
          />
          <Select
            label="Dependencia *"
            options={dependenciaOptions}
            value={formData.dependencia_id}
            onChange={(e) => setFormData({ ...formData, dependencia_id: e.target.value })}
          />
          <div className="teams-page__form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {editingTeam ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamsPage;
