import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { fetchWorkers, createWorker, updateWorker, deleteWorker, setSelectedWorker, clearSelectedWorker } from 'modules/workers/store/workersSlice';
import { fetchAllCatalogs } from 'modules/shared/store/slices/catalogsSlice';
import { fetchTeams } from 'modules/teams/store/teamsSlice';
import { Button, Card, Input, Select, Badge, Spinner } from 'modules/shared/components/atoms';
import Modal from 'modules/shared/components/molecules/Modal/Modal';
import EmptyState from 'modules/shared/components/molecules/EmptyState/EmptyState';
import type { WorkerFormData } from 'modules/workers/types/workers.types';
import type { SelectOption } from 'modules/shared/types/common.types';
import type { Role, City, Arl, Eps, BloodType, Team } from 'modules/shared/types/database.types';
import './WorkersPage.scss';

const MONTHS = [
  { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' }, { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
];

const initialFormData: WorkerFormData = {
  identification: '',
  full_name: '',
  email: '',
  birthday_day: 1,
  birthday_month: 1,
  address: '',
  start_date: '',
  status: 'active',
  role_id: '',
  city_id: '',
  arl_id: '',
  eps_id: '',
  blood_type_id: '',
  team_id: '',
};

const WorkersPage = () => {
  const dispatch = useAppDispatch();
  const { workers, selectedWorker, status } = useAppSelector((state) => state.workers);
  const { teams } = useAppSelector((state) => state.teams);
  const { roles, cities, arls, eps, bloodTypes } = useAppSelector((state) => state.catalogs);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<WorkerFormData>(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkers());
    dispatch(fetchAllCatalogs());
    dispatch(fetchTeams());
  }, [dispatch]);

  const filteredWorkers = workers.filter((w: any) =>
    w.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.identification.includes(searchTerm)
  );

  const roleOptions: SelectOption[] = roles.map((r: Role) => ({ value: r.id, label: r.name }));
  const cityOptions: SelectOption[] = cities.map((c: City) => ({ value: c.id, label: c.name }));
  const arlOptions: SelectOption[] = arls.map((a: Arl) => ({ value: a.id, label: a.name }));
  const epsOptions: SelectOption[] = eps.map((e: Eps) => ({ value: e.id, label: e.name }));
  const bloodTypeOptions: SelectOption[] = bloodTypes.map((bt: BloodType) => ({ value: bt.id, label: bt.name }));
  const teamOptions: SelectOption[] = teams.map((t: Team) => ({ value: t.id, label: `${t.name} (${t.dependencia?.name || ''})` }));
  const dayOptions: SelectOption[] = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

  const openCreateModal = () => {
    setFormData(initialFormData);
    dispatch(clearSelectedWorker());
    setShowModal(true);
  };

  const openEditModal = (worker: typeof workers[0]) => {
    dispatch(setSelectedWorker(worker));
    setFormData({
      identification: worker.identification,
      full_name: worker.full_name,
      email: worker.email || '',
      birthday_day: worker.birthday_day,
      birthday_month: worker.birthday_month,
      address: worker.address || '',
      start_date: worker.start_date || '',
      status: worker.status,
      role_id: worker.role_id,
      city_id: worker.city_id || '',
      arl_id: worker.arl_id || '',
      eps_id: worker.eps_id || '',
      blood_type_id: worker.blood_type_id || '',
      team_id: worker.team_id,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedWorker) {
        await dispatch(updateWorker({ id: selectedWorker.id, data: formData })).unwrap();
      } else {
        await dispatch(createWorker(formData)).unwrap();
      }
      setShowModal(false);
      setFormData(initialFormData);
    } catch {
      // Error handled by redux
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este trabajador?')) {
      await dispatch(deleteWorker(id));
    }
  };

  if (status === 'loading' && workers.length === 0) {
    return (
      <div className="workers-page__loading">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="workers-page">
      <Card
        title="Trabajadores"
        subtitle={`${workers.length} registrados`}
        actions={
          <Button variant="primary" icon={<Plus size={18} />} onClick={openCreateModal}>
            Nuevo Trabajador
          </Button>
        }
      >
        {/* Search */}
        <div className="workers-page__search">
          <Search size={16} className="workers-page__search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            className="workers-page__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="workers-page__table-wrapper">
          <table className="workers-page__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Equipo</th>
                <th>Inicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      icon={<Users size={48} />}
                      title="Sin trabajadores"
                      description="No se encontraron trabajadores. Registra el primero."
                    />
                  </td>
                </tr>
              ) : (
              filteredWorkers.map((worker: any) => (
                <tr key={worker.id}>
                  <td className="workers-page__name">{worker.full_name}</td>
                  <td className="workers-page__email">{worker.email || '-'}</td>
                  <td><Badge variant="primary">{worker.role?.name || '-'}</Badge></td>
                  <td><Badge variant="neutral">{worker.team?.name || '-'}</Badge></td>
                  <td className="workers-page__date">{worker.start_date || '-'}</td>
                  <td>
                    <Badge variant={worker.status === 'active' ? 'success' : 'danger'}>
                      {worker.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <div className="workers-page__actions">
                      <button className="workers-page__action-btn" onClick={() => openEditModal(worker)} aria-label="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="workers-page__action-btn workers-page__action-btn--danger" onClick={() => handleDelete(worker.id)} aria-label="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Crear/Editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedWorker ? 'Editar Trabajador' : 'Nuevo Trabajador'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="workers-page__form">
          <div className="workers-page__form-grid">
            <Input
              label="Nombre Completo *"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <Input
              label="Identificación *"
              value={formData.identification}
              onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
              required
            />
            <Input
              label="Email Corporativo"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nombre@adl.com.co"
            />
            <Input
              label="Fecha de Inicio"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <Select
              label="Estado"
              options={[{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            />
            <Select
              label="Día de Cumpleaños"
              options={dayOptions}
              value={String(formData.birthday_day)}
              onChange={(e) => setFormData({ ...formData, birthday_day: Number(e.target.value) })}
            />
            <Select
              label="Mes de Cumpleaños"
              options={MONTHS}
              value={String(formData.birthday_month)}
              onChange={(e) => setFormData({ ...formData, birthday_month: Number(e.target.value) })}
            />
            <Input
              label="Dirección"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Select
              label="Rol *"
              options={roleOptions}
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
            />
            <Select
              label="Equipo *"
              options={teamOptions}
              value={formData.team_id}
              onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
            />
            <Select
              label="Ciudad"
              options={cityOptions}
              value={formData.city_id}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
            />
            <Select
              label="ARL"
              options={arlOptions}
              value={formData.arl_id}
              onChange={(e) => setFormData({ ...formData, arl_id: e.target.value })}
            />
            <Select
              label="EPS"
              options={epsOptions}
              value={formData.eps_id}
              onChange={(e) => setFormData({ ...formData, eps_id: e.target.value })}
            />
            <Select
              label="Tipo de Sangre"
              options={bloodTypeOptions}
              value={formData.blood_type_id}
              onChange={(e) => setFormData({ ...formData, blood_type_id: e.target.value })}
            />
          </div>
          <div className="workers-page__form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {selectedWorker ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkersPage;
