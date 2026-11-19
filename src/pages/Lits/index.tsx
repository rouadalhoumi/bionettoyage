import { useState, useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";

import {
  litsAPI,
  chambresAPI,
  etatsAPI,
  servicesAPI,
  Lit,
  Chambre,
  Etat,
  Service,
} from "../../services/api";

import {
  LitIcon,
  AppartementIcon,
  DortoirIcon,
  CloseIcon,
  PencilIcon,
  TrashBinIcon,
} from "../../icons";

const ETAT_STYLES: Record<
  number,
  {
    badge: string;
    dot: string;
    border: string;
    bg: string;
    text: string;
  }
> = {
  1: {
    badge: "bg-green-600",
    dot: "bg-green-500",
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  2: {
    badge: "bg-amber-500",
    dot: "bg-amber-500",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  3: {
    badge: "bg-blue-600",
    dot: "bg-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  4: {
    badge: "bg-red-600",
    dot: "bg-red-500",
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500";

// ─────────────────────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────────────────────

const LitModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  initial,
  chambres,
  etats,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Lit, "idLit">) => Promise<void>;
  loading: boolean;
  initial?: Lit | null;
  chambres: Chambre[];
  etats: Etat[];
}) => {
  const [form, setForm] = useState({
    numeroLit: "",
    idChambre: chambres[0]?.idChambre || 0,
    idEtat: 1,
  });

  useEffect(() => {
    setForm({
      numeroLit: initial?.numeroLit || "",
      idChambre:
        initial?.idChambre || chambres[0]?.idChambre || 0,
      idEtat: initial?.idEtat || 1,
    });
  }, [initial, isOpen, chambres]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.numeroLit || !form.idChambre) {
      alert("Remplissez tous les champs");
      return;
    }

    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="relative overflow-hidden bg-blue-600 px-6 py-5 text-white">
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 right-16 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <LitIcon className="h-4.5 w-4.5" />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-100">
                Gestion des lits
              </p>

              <h2 className="mt-1 text-lg font-bold">
                {initial ? "Modifier le lit" : "Nouveau lit"}
              </h2>

              <p className="mt-1 text-xs text-blue-100">
                Numéro, chambre et état initial
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 p-6">
          {/* Numéro */}
          <div>
            <label className={labelClass}>
              <LitIcon className="h-3.5 w-3.5 text-blue-600" />
              Numéro de lit
            </label>

            <input
              type="text"
              value={form.numeroLit}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  numeroLit: e.target.value,
                }))
              }
              placeholder="Ex : 101-A, 101-B..."
              className={inputClass}
            />
          </div>

          {/* Chambre */}
          <div>
            <label className={labelClass}>
              <DortoirIcon className="h-3.5 w-3.5 text-blue-600" />
              Chambre
            </label>

            <select
              value={form.idChambre}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  idChambre: parseInt(e.target.value),
                }))
              }
              className={inputClass}
            >
              {chambres.map((c) => (
                <option
                  key={c.idChambre}
                  value={c.idChambre}
                >
                  Chambre {c.numeroChambre}
                </option>
              ))}
            </select>
          </div>

          {/* État */}
          <div>
            <label className={labelClass}>
              État initial
            </label>

            <select
              value={form.idEtat}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  idEtat: parseInt(e.target.value),
                }))
              }
              className={inputClass}
            >
              {etats.map((e) => (
                <option key={e.idEtat} value={e.idEtat}>
                  {e.libelle}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Enregistrement..."
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

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Lits() {
  const [lits, setLits] = useState<Lit[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [etats, setEtats] = useState<Etat[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Lit | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEtat, setFilterEtat] = useState("ALL");
  const [filterService, setFilterService] = useState("ALL");

  // ───────────────────────────────────────────────────────────────────────────
  // Load data
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [l, c, e, s] = await Promise.all([
          litsAPI.getAll(),
          chambresAPI.getAll(),
          etatsAPI.getAll(),
          servicesAPI.getAll(),
        ]);

        setLits(l.data);
        setChambres(c.data);
        setEtats(e.data);
        setServices(s.data);
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

  // ───────────────────────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────────────────────

  const getChambre = (idChambre: number) =>
    chambres.find((c) => c.idChambre === idChambre);

  const getService = (idEtage: number) =>
    services.find((s) => s.idEtage === idEtage);

  const getEtat = (idEtat: number) =>
    etats.find((e) => e.idEtat === idEtat);

  // ───────────────────────────────────────────────────────────────────────────
  // Filters
  // ───────────────────────────────────────────────────────────────────────────

  const filtered = lits.filter((l) => {
    const chambre = getChambre(l.idChambre);
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      l.numeroLit.toLowerCase().includes(search) ||
      chambre?.numeroChambre
        ?.toLowerCase()
        .includes(search);

    const matchesEtat =
      filterEtat === "ALL" ||
      l.idEtat === parseInt(filterEtat);

    const matchesService =
      filterService === "ALL" ||
      chambre?.idEtage === parseInt(filterService);

    return matchesSearch && matchesEtat && matchesService;
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Save
  // ───────────────────────────────────────────────────────────────────────────

  const handleSave = async (data: Omit<Lit, "idLit">) => {
    try {
      setModalLoading(true);

      if (editTarget) {
        const res = await litsAPI.update(
          editTarget.idLit,
          data
        );

        setLits((prev) =>
          prev.map((l) =>
            l.idLit === editTarget.idLit ? res.data : l
          )
        );
      } else {
        const res = await litsAPI.create(data);

        setLits((prev) => [...prev, res.data]);
      }

      setEditTarget(null);
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setModalLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Delete
  // ───────────────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce lit ?")) return;

    try {
      await litsAPI.delete(id);

      setLits((prev) =>
        prev.filter((l) => l.idLit !== id)
      );
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const countByEtat = (id: number) =>
    lits.filter((l) => l.idEtat === id).length;

  // ───────────────────────────────────────────────────────────────────────────
  // Loading
  // ───────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="text-sm text-slate-400">
            Chargement des lits...
          </p>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Error
  // ───────────────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
        <p className="text-sm font-semibold text-red-700">
          Impossible de charger les lits
        </p>

        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <>
      <PageMeta
        title="Lits | Bionettoyage"
        description="Gestion des lits"
      />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Lits
          </h1>
        </div>

        <button
          onClick={() => {
            setEditTarget(null);
            setIsModalOpen(true);
            document.body.classList.add("modal-open");
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
        >
          <span className="text-lg font-light leading-none">
            +
          </span>

          Nouveau lit
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {etats.map((e) => {
          const style =
            ETAT_STYLES[e.idEtat] || ETAT_STYLES[1];

          const active =
            filterEtat === String(e.idEtat);

          return (
            <button
              key={e.idEtat}
              onClick={() =>
                setFilterEtat(
                  active ? "ALL" : String(e.idEtat)
                )
              }
              className={`group rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                style.border
              } ${
                active
                  ? "ring-2 ring-blue-300 ring-offset-1"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.bg}`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
                  />
                </div>

                <div>
                  <p
                    className={`text-xl font-bold ${style.text}`}
                  >
                    {countByEtat(e.idEtat)}
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {e.libelle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_190px]">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par numéro de lit ou chambre..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className={inputClass}
            />
          </div>

          {/* Service */}
          <select
            value={filterService}
            onChange={(e) =>
              setFilterService(e.target.value)
            }
            className={inputClass}
          >
            <option value="ALL">
              Tous les services
            </option>

            {services.map((s) => (
              <option
                key={s.idEtage}
                value={s.idEtage}
              >
                {s.numeroEtage}
              </option>
            ))}
          </select>

          {/* Etat */}
          <select
            value={filterEtat}
            onChange={(e) =>
              setFilterEtat(e.target.value)
            }
            className={inputClass}
          >
            <option value="ALL">
              Tous les états
            </option>

            {etats.map((e) => (
              <option
                key={e.idEtat}
                value={e.idEtat}
              >
                {e.libelle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-600">
            {filtered.length}
          </span>{" "}
          lit{filtered.length !== 1 ? "s" : ""} affiché
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {(searchTerm ||
          filterEtat !== "ALL" ||
          filterService !== "ALL") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterEtat("ALL");
              setFilterService("ALL");
            }}
            className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {[
                  "#",
                  "N° Lit",
                  "Chambre",
                  "Service",
                  "État",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <LitIcon className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Aucun lit trouvé
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier vos filtres ou votre
                      recherche.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((l) => {
                  const chambre = getChambre(l.idChambre);
                  const service = getService(
                    chambre?.idEtage || 0
                  );
                  const etat = getEtat(l.idEtat);

                  const style =
                    ETAT_STYLES[l.idEtat] ||
                    ETAT_STYLES[1];

                  return (
                    <tr
                      key={l.idLit}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      {/* ID */}
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                        #{l.idLit}
                      </td>

                      {/* Lit */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                            <LitIcon className="h-4 w-4 text-blue-600" />
                          </div>

                          <span className="font-semibold text-slate-800">
                            {l.numeroLit}
                          </span>
                        </div>
                      </td>

                      {/* Chambre */}
                      <td className="px-4 py-3.5 text-slate-600">
                        <span className="flex items-center gap-2">
                          <DortoirIcon className="h-4 w-4 text-slate-400" />

                          {chambre?.numeroChambre || "—"}
                        </span>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3.5 text-slate-600">
                        <span className="flex items-center gap-2">
                          <AppartementIcon className="h-4 w-4 text-slate-400" />

                          {service?.numeroEtage || "—"}
                        </span>
                      </td>

                      {/* Etat */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${style.badge}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                          {etat?.libelle || "—"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditTarget(l);
                              setIsModalOpen(true);
                              document.body.classList.add(
                                "modal-open"
                              );
                            }}
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                            title="Modifier"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(l.idLit)
                            }
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                            title="Supprimer"
                          >
                            <TrashBinIcon className="h-4 w-4" />
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
      </div>

      {/* Modal */}
      <LitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTarget(null);
          document.body.classList.remove("modal-open");
        }}
        onSave={handleSave}
        loading={modalLoading}
        initial={editTarget}
        chambres={chambres}
        etats={etats}
      />
    </>
  );
}