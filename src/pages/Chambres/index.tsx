import { useState, useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";

import {
  chambresAPI,
  servicesAPI,
  litsAPI,
  Chambre,
  Service,
  Lit,
} from "../../services/api";

import {
  AppartementIcon,
  DortoirIcon,
  LitIcon,
  CloseIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../icons";

const STATUS_DOT: Record<number, string> = {
  1: "bg-green-600",
  2: "bg-amber-500",
  3: "bg-blue-700",
  4: "bg-red-600",
};

const STATUS_LABELS: Record<number, string> = {
  1: "Libre",
  2: "Occupée",
  3: "En nettoyage",
  4: "Hors service",
};

const STATUS_STYLES: Record<
  number,
  { text: string; bg: string; border: string }
> = {
  1: {
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  2: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  3: {
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  4: {
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500";

const ChambreModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  initial,
  services,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Chambre, "idChambre">) => Promise<void>;
  loading: boolean;
  initial?: Chambre | null;
  services: Service[];
}) => {
  const [form, setForm] = useState({
    numeroChambre: "",
    idEtage: services[0]?.idEtage || 0,
  });

  useEffect(() => {
    setForm({
      numeroChambre: initial?.numeroChambre || "",
      idEtage:
        initial?.idEtage ||
        services[0]?.idEtage ||
        0,
    });
  }, [initial, isOpen, services]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.numeroChambre || !form.idEtage) {
      alert("Remplissez tous les champs");
      return;
    }

    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="relative overflow-hidden bg-blue-700 px-6 py-5 text-white">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <DortoirIcon className="h-4 w-4" />
              </div>

              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-100">
                Chambres
              </p>

              <h2 className="text-base font-bold">
                {initial ? "Modifier la chambre" : "Nouvelle chambre"}
              </h2>

              <p className="mt-1 text-xs text-blue-100">
                Numéro et service de la chambre
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 p-6">
          <div>
            <label className={labelClass}>
              <DortoirIcon className="h-3.5 w-3.5 text-blue-700" />
              Numéro de chambre
            </label>

            <input
              type="text"
              value={form.numeroChambre}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  numeroChambre: e.target.value,
                }))
              }
              placeholder="Ex: 101, 202..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              <AppartementIcon className="h-3.5 w-3.5 text-blue-700" />
              Service
            </label>

            <select
              value={form.idEtage}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  idEtage: parseInt(e.target.value),
                }))
              }
              className={inputClass}
            >
              {services.map((s) => (
                <option key={s.idEtage} value={s.idEtage}>
                  {s.numeroEtage}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-700 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-40"
            >
              {loading
                ? "..."
                : initial
                ? "Modifier"
                : "Ajouter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Chambres() {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [lits, setLits] = useState<Lit[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [editTarget, setEditTarget] = useState<Chambre | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [c, s, l] = await Promise.all([
          chambresAPI.getAll(),
          servicesAPI.getAll(),
          litsAPI.getAll(),
        ]);

        setChambres(c.data);
        setServices(s.data);
        setLits(l.data);
        setError(null);
      } catch {
        setError(
          "Erreur lors du chargement. Vérifiez que le serveur Spring Boot est lancé."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const getService = (idEtage: number) =>
    services.find((s) => s.idEtage === idEtage);

  const getLitsForChambre = (idChambre: number) =>
    lits.filter((l) => l.idChambre === idChambre);

  const filtered = chambres.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      c.numeroChambre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesService =
      filterService === "ALL" ||
      c.idEtage === parseInt(filterService);

    return matchesSearch && matchesService;
  });

  const handleSave = async (
    data: Omit<Chambre, "idChambre">
  ) => {
    try {
      setModalLoading(true);

      if (editTarget) {
        const res = await chambresAPI.update(
          editTarget.idChambre,
          data
        );

        setChambres((prev) =>
          prev.map((c) =>
            c.idChambre === editTarget.idChambre
              ? res.data
              : c
          )
        );
      } else {
        const res = await chambresAPI.create(data);

        setChambres((prev) => [...prev, res.data]);
      }

      setEditTarget(null);
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette chambre ?")) return;

    try {
      await chambresAPI.delete(id);

      setChambres((prev) =>
        prev.filter((c) => c.idChambre !== id)
      );
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const openCreateModal = () => {
    setEditTarget(null);
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const openEditModal = (chambre: Chambre) => {
    setEditTarget(chambre);
    setIsModalOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTarget(null);
    document.body.classList.remove("modal-open");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterService("ALL");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700" />
          <p className="text-xs font-medium text-slate-400">
            Chargement des chambres...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <span className="text-sm text-red-600">!</span>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">
              Erreur
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Chambres | Bionettoyage"
        description="Gestion des chambres"
      />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            <strong>Chambres</strong>
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md"
        >
          <span className="text-base font-light leading-none">
            +
          </span>
          Nouvelle chambre
        </button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {/* Total */}
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="absolute -right-3 -top-3 h-14 w-14 rounded-full bg-blue-700/10" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 shadow-sm">
              <DortoirIcon className="h-4 w-4 text-white" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">
                Total
              </p>

              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {chambres.length}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        {[1, 2, 3, 4].map((etatId) => {
          const s = STATUS_STYLES[etatId];

          const count = lits.filter(
            (l) => l.idEtat === etatId
          ).length;

          return (
            <div
              key={etatId}
              className={`relative overflow-hidden rounded-xl border ${s.border} ${s.bg} p-4`}
            >
              <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/50" />

              <div className="relative">
                <p
                  className={`text-xl font-bold ${s.text}`}
                >
                  {count}
                </p>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {STATUS_LABELS[etatId]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par numéro de chambre..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className={inputClass}
            />
          </div>

          <select
            value={filterService}
            onChange={(e) =>
              setFilterService(e.target.value)
            }
            className={`${inputClass} sm:w-52`}
          >
            <option value="ALL">Tous les services</option>

            {services.map((s) => (
              <option
                key={s.idEtage}
                value={s.idEtage}
              >
                {s.numeroEtage}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400">
          {filtered.length} chambre
          {filtered.length !== 1 ? "s" : ""} affichée
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {(searchTerm || filterService !== "ALL") && (
          <button
            onClick={resetFilters}
            className="text-[11px] font-bold uppercase tracking-wide text-blue-700 transition hover:text-blue-800"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {[
                "#",
                "N° Chambre",
                "Service",
                "Lits",
                "État des lits",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-14 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                      <DortoirIcon className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-semibold text-slate-600">
                      Aucune chambre trouvée
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier vos critères de recherche.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const service = getService(c.idEtage);
                const chambreLits = getLitsForChambre(
                  c.idChambre
                );

                return (
                  <tr
                    key={c.idChambre}
                    className="transition-colors hover:bg-slate-50"
                  >
                    {/* ID */}
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      #{c.idChambre}
                    </td>

                    {/* Chambre */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                          <DortoirIcon className="h-3.5 w-3.5 text-blue-700" />
                        </span>

                        {c.numeroChambre}
                      </span>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3 text-slate-600">
                      {service?.numeroEtage || "—"}
                    </td>

                    {/* Lits */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        <LitIcon className="h-3 w-3" />
                        {chambreLits.length}
                      </span>
                    </td>

                    {/* État */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {chambreLits.length > 0 ? (
                          chambreLits.map((l) => (
                            <div
                              key={l.idLit}
                              className={`h-2.5 w-2.5 rounded-sm ${
                                STATUS_DOT[l.idEtat] ||
                                "bg-slate-300"
                              }`}
                              title={`Lit ${l.numeroLit} — ${
                                STATUS_LABELS[l.idEtat] || "?"
                              }`}
                            />
                          ))
                        ) : (
                          <span className="text-xs text-slate-300">
                            Aucun lit
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            openEditModal(c)
                          }
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Modifier"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(c.idChambre)
                          }
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Supprimer"
                        >
                          <TrashBinIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ChambreModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        loading={modalLoading}
        initial={editTarget}
        services={services}
      />
    </>
  );
}