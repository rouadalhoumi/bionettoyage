import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { servicesAPI, chambresAPI, litsAPI, Service, Chambre, Lit } from "../../services/api";
import {
  AppartementIcon,
  CloseIcon,
  PencilIcon,
  TrashBinIcon,
  DortoirIcon,
  LitIcon,
} from "../../icons";

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
const labelClass = "mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500";

const ServiceModal = ({ isOpen, onClose, onSave, loading, initial }: {
  isOpen: boolean; onClose: () => void;
  onSave: (data: Omit<Service, "idEtage">) => Promise<void>;
  loading: boolean; initial?: Service | null;
}) => {
  const [form, setForm] = useState({ numeroEtage: "" });
  useEffect(() => { setForm({ numeroEtage: initial?.numeroEtage || "" }); }, [initial, isOpen]);
  if (!isOpen) return null;
  const handleSave = async () => {
    if (!form.numeroEtage) { alert("Remplissez le nom du service"); return; }
    await onSave(form); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-blue-700 px-5 py-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <AppartementIcon className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold">{initial ? "Modifier le service" : "Nouveau service"}</h2>
              <p className="mt-0.5 text-xs text-blue-100">{initial ? "Mettre à jour les informations" : "Ajouter un nouveau service"}</p>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white">
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className={labelClass}><AppartementIcon className="h-3.5 w-3.5 text-blue-700" /> Nom du service</label>
            <input type="text" value={form.numeroEtage} onChange={e => setForm({ numeroEtage: e.target.value })}
              placeholder="Ex: 1er Étage" className={inputClass} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50">
              Annuler
            </button>
            <button onClick={handleSave} disabled={loading}
              className="flex-1 rounded-lg bg-blue-700 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-40">
              {loading ? "..." : initial ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [lits, setLits] = useState<Lit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [s, c, l] = await Promise.all([servicesAPI.getAll(), chambresAPI.getAll(), litsAPI.getAll()]);
        setServices(s.data); setChambres(c.data); setLits(l.data); setError(null);
      } catch { setError("Erreur lors du chargement. Vérifiez que le serveur Spring Boot est lancé."); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const getChambreCount = (id: number) => chambres.filter(c => c.idEtage === id).length;
  const getLitCount = (id: number) => {
    const ids = chambres.filter(c => c.idEtage === id).map(c => c.idChambre);
    return lits.filter(l => ids.includes(l.idChambre)).length;
  };

  const filtered = services.filter(s => !searchTerm || s.numeroEtage.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSave = async (data: Omit<Service, "idEtage">) => {
    try {
      setModalLoading(true);
      if (editTarget) {
        const res = await servicesAPI.update(editTarget.idEtage, data);
        setServices(prev => prev.map(s => s.idEtage === editTarget.idEtage ? res.data : s));
      } else {
        const res = await servicesAPI.create(data);
        setServices(prev => [...prev, res.data]);
      }
      setEditTarget(null);
    } catch { alert("Erreur lors de l'enregistrement"); }
    finally { setModalLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce service ? Toutes les chambres et lits associés seront supprimés.")) return;
    try { await servicesAPI.delete(id); setServices(prev => prev.filter(s => s.idEtage !== id)); }
    catch { alert("Erreur lors de la suppression"); }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><p className="text-slate-400">Chargement...</p></div>;
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-700">{error}</p></div>;

  return (
    <>
      <PageMeta title="Services | Bionettoyage" description="Gestion des services" />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">Liste des services</h1>
        </div>
        <button onClick={() => { setEditTarget(null); setIsModalOpen(true); document.body.classList.add("modal-open"); }}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md">
          <span className="text-base font-light leading-none">+</span> Nouveau service
        </button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-blue-700/10" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 shadow-sm">
              <AppartementIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-blue-700">Services</p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-slate-300 bg-white p-4">
          <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-slate-700/10" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 shadow-sm">
              <DortoirIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Chambres</p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">{chambres.length}</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-green-600/10" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 shadow-sm">
              <LitIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-green-700">Lits</p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">{lits.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <input type="text" placeholder="Rechercher un service..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={inputClass} />
      </div>

      <p className="mb-3 text-xs font-semibold text-slate-400">{filtered.length} service{filtered.length !== 1 ? "s" : ""} affiché{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200">
            <AppartementIcon className="h-5 w-5 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-500">Aucun service trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => {
            const chambreCount = getChambreCount(s.idEtage);
            const litCount = getLitCount(s.idEtage);
            return (
              <div key={s.idEtage} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                <div className="relative overflow-hidden bg-blue-700 px-4 py-3.5 text-white">
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                        <AppartementIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100">Service</p>
                        <h2 className="text-sm font-bold">{s.numeroEtage}</h2>
                      </div>
                    </div>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-blue-100">#{s.idEtage}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-slate-700">
                        <DortoirIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <p className="text-lg font-bold text-slate-900">{chambreCount}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Chambres</p>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-green-600">
                        <LitIcon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <p className="text-lg font-bold text-green-700">{litCount}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-green-700/60">Lits</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                    <button onClick={() => { setEditTarget(s); setIsModalOpen(true); document.body.classList.add("modal-open"); }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-bold uppercase tracking-wide text-blue-700 transition hover:bg-blue-700 hover:text-white">
                      <PencilIcon className="h-3.5 w-3.5" /> Modifier
                    </button>
                    <button onClick={() => handleDelete(s.idEtage)}
                      className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2.5 text-red-600 transition hover:bg-red-600 hover:text-white">
                      <TrashBinIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ServiceModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditTarget(null); document.body.classList.remove("modal-open"); }}
        onSave={handleSave} loading={modalLoading} initial={editTarget} />
    </>
  );
}