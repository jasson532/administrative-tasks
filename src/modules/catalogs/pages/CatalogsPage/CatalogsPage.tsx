import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { fetchAllCatalogs } from 'modules/shared/store/slices/catalogsSlice';
import { supabase } from 'modules/shared/services/supabase/supabaseClient';
import { Button, Card, Input, Badge, Spinner } from 'modules/shared/components/atoms';
import Modal from 'modules/shared/components/molecules/Modal/Modal';
import './CatalogsPage.scss';

type CatalogType = 'adl_roles' | 'adl_cities' | 'adl_arls' | 'adl_eps' | 'adl_blood_types' | 'adl_news_types' | 'adl_dependencias' | 'adl_holidays';

interface CatalogConfig {
  key: CatalogType;
  label: string;
  fields: string[];
}

const CATALOG_CONFIGS: CatalogConfig[] = [
  { key: 'adl_roles', label: 'Roles', fields: ['name'] },
  { key: 'adl_cities', label: 'Ciudades', fields: ['name'] },
  { key: 'adl_arls', label: 'ARL', fields: ['name'] },
  { key: 'adl_eps', label: 'EPS', fields: ['name'] },
  { key: 'adl_blood_types', label: 'Tipos de Sangre', fields: ['name'] },
  { key: 'adl_news_types', label: 'Tipos de Novedad', fields: ['name', 'convention'] },
  { key: 'adl_dependencias', label: 'Dependencias', fields: ['name'] },
  { key: 'adl_holidays', label: 'Festivos', fields: ['name', 'date'] },
];

const CatalogsPage = () => {
  const dispatch = useAppDispatch();
  const catalogs = useAppSelector((state) => state.catalogs);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogConfig>(CATALOG_CONFIGS[0]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newConvention, setNewConvention] = useState('');
  const [newDate, setNewDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCatalogs());
  }, [dispatch]);

  const getCurrentItems = () => {
    const map: Record<CatalogType, unknown[]> = {
      adl_roles: catalogs.roles,
      adl_cities: catalogs.cities,
      adl_arls: catalogs.arls,
      adl_eps: catalogs.eps,
      adl_blood_types: catalogs.bloodTypes,
      adl_news_types: catalogs.newsTypes,
      adl_dependencias: catalogs.dependencias,
      adl_holidays: catalogs.holidays,
    };
    return map[selectedCatalog.key] as Array<{ id: string; name: string; convention?: string; date?: string }>;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSubmitting(true);
    try {
      const insertData: Record<string, string> = { name: newName };
      if (selectedCatalog.key === 'adl_news_types') {
        insertData.convention = newConvention;
      }
      if (selectedCatalog.key === 'adl_holidays') {
        insertData.date = newDate;
      }

      const { error } = await supabase.from(selectedCatalog.key).insert(insertData);
      if (error) throw error;

      dispatch(fetchAllCatalogs());
      setShowModal(false);
      setNewName('');
      setNewConvention('');
      setNewDate('');
    } catch (error) {
      console.error('Error creating catalog item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este elemento?')) return;

    try {
      const { error } = await supabase.from(selectedCatalog.key).delete().eq('id', id);
      if (error) throw error;
      dispatch(fetchAllCatalogs());
    } catch (error) {
      console.error('Error deleting catalog item:', error);
    }
  };

  if (catalogs.status === 'loading') {
    return (
      <div className="catalogs-page__loading">
        <Spinner size="lg" />
      </div>
    );
  }

  const items = getCurrentItems();

  return (
    <div className="catalogs-page">
      {/* Catalog Tabs */}
      <div className="catalogs-page__tabs">
        {CATALOG_CONFIGS.map((config) => (
          <button
            key={config.key}
            className={`catalogs-page__tab ${selectedCatalog.key === config.key ? 'catalogs-page__tab--active' : ''}`}
            onClick={() => setSelectedCatalog(config)}
          >
            {config.label}
          </button>
        ))}
      </div>

      <Card
        title={selectedCatalog.label}
        subtitle={`${items.length} elementos`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={16} />} onClick={() => setShowModal(true)}>
            Agregar
          </Button>
        }
      >
        <div className="catalogs-page__list">
          {items.map((item) => (
            <div key={item.id} className="catalogs-page__item">
              <div className="catalogs-page__item-info">
                <span className="catalogs-page__item-name">{item.name}</span>
                {item.convention && <Badge variant="primary">{item.convention}</Badge>}
                {item.date && <Badge variant="neutral">{item.date}</Badge>}
              </div>
              <button className="catalogs-page__delete-btn" onClick={() => handleDelete(item.id)} aria-label="Eliminar">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Nuevo ${selectedCatalog.label}`}
        size="sm"
      >
        <form onSubmit={handleCreate} className="catalogs-page__form">
          <Input
            label="Nombre *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Nombre del ${selectedCatalog.label.toLowerCase()}`}
            required
          />
          {selectedCatalog.key === 'adl_news_types' && (
            <Input
              label="Convención *"
              value={newConvention}
              onChange={(e) => setNewConvention(e.target.value)}
              placeholder="Ej: VA, AU, IN"
              required
            />
          )}
          {selectedCatalog.key === 'adl_holidays' && (
            <Input
              label="Fecha *"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
          )}
          <div className="catalogs-page__form-actions">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Crear
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CatalogsPage;
