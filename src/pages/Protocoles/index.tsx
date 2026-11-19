import { useState, useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";

import {
  protocolesAPI,
  historiqueAPI,
  Protocole,
  HistoriqueLit,
} from "../../services/api";

import {
  DocsIcon,
  PageIcon,
  TimeIcon,
  PieChartIcon,
  PencilIcon,
  TrashBinIcon,
  CloseIcon,
  BoxIconLine,
} from "../../icons";

const FREQUENCES = [
  "Quotidien",
  "Deux fois par jour",
  "Hebdomadaire",
  "Mensuel",
  "Immédiat",
  "À la demande",
];

const FREQ_STYLES: Record<
  string,
  {
    solid: string;
    text: string;
    bg: string;
    border: string;
  }
> = {
  Quotidien: {
    solid: "bg-blue-600",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "Deux fois par jour": {
    solid: "bg-slate-700",
    text: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  Hebdomadaire: {
    solid: "bg-green-600",
    text: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  Mensuel: {
    solid: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Immédiat: {
    solid: "bg-red-600",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  "À la demande": {
    solid: "bg-slate-500",
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500";

const ProtocoleModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<Protocole, "idProtocole">
  ) => Promise<void>;
  loading: boolean;
  initial?: Protocole | null;
}) => {
  const [form, setForm] = useState({
    nomProtocole: "",
    description: "",
    frequence: FREQUENCES[0],
  });

  useEffect(() => {
    if (initial) {
      setForm({
        nomProtocole: initial.nomProtocole,
        description: initial.description,
        frequence: initial.frequence,
      });
    } else {
      setForm({
        nomProtocole: "",
        description: "",
        frequence: FREQUENCES[0],
      });
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (
      !form.nomProtocole ||
      !form.description ||
      !form.frequence
    ) {
      alert("Remplissez tous les champs");
      return;
    }

    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Protocoles
            </p>

            <h2 className="text-lg font-bold text-slate-900">
              {initial
                ? "Modifier le protocole"
                : "Nouveau protocole"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {initial
                ? "Mettre à jour les informations du protocole"
                : "Créer un nouveau protocole de nettoyage"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 px-6 py-6">
          {/* Nom */}
          <div>
            <label className={labelClass}>
              <DocsIcon className="h-3.5 w-3.5 text-blue-600" />
              Nom du protocole
            </label>

            <input
              type="text"
              value={form.nomProtocole}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  nomProtocole: e.target.value,
                }))
              }
              placeholder="Ex: Nettoyage Chambre Standard"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>
              <PageIcon className="h-3.5 w-3.5 text-blue-600" />
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              placeholder="Décrivez les étapes du protocole..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Fréquence */}
          <div>
            <label className={labelClass}>
              <TimeIcon className="h-3.5 w-3.5 text-blue-600" />
              Fréquence
            </label>

            <select
              value={form.frequence}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  frequence: e.target.value,
                }))
              }
              className={inputClass}
            >
              {FREQUENCES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
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

export default function Protocoles() {
  const [protocoles, setProtocoles] = useState<Protocole[]>([]);
  const [historiques, setHistoriques] = useState<HistoriqueLit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editTarget, setEditTarget] =
    useState<Protocole | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterFreq, setFilterFreq] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [p, h] = await Promise.all([
          protocolesAPI.getAll(),
          historiqueAPI.getAll(),
        ]);

        setProtocoles(p.data);
        setHistoriques(h.data);
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

  const getUsageCount = (idProtocole: number) =>
    historiques.filter(
      (h) => h.idProtocole === idProtocole
    ).length;

  const filtered = protocoles.filter((p) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !search ||
      p.nomProtocole.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.frequence.toLowerCase().includes(search);

    const matchesFreq =
      filterFreq === "ALL" ||
      p.frequence === filterFreq;

    return matchesSearch && matchesFreq;
  });

  const handleSave = async (
    data: Omit<Protocole, "idProtocole">
  ) => {
    try {
      setModalLoading(true);

      if (editTarget) {
        const res = await protocolesAPI.update(
          editTarget.idProtocole,
          data
        );

        setProtocoles((prev) =>
          prev.map((p) =>
            p.idProtocole === editTarget.idProtocole
              ? res.data
              : p
          )
        );
      } else {
        const res = await protocolesAPI.create(data);

        setProtocoles((prev) => [
          ...prev,
          res.data,
        ]);
      }

      setEditTarget(null);
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce protocole ?")) return;

    try {
      await protocolesAPI.delete(id);

      setProtocoles((prev) =>
        prev.filter((p) => p.idProtocole !== id)
      );
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <p className="text-xs font-medium text-slate-400">
            Chargement des protocoles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Protocoles | Bionettoyage"
        description="Gestion des protocoles de nettoyage"
      />

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Protocoles
          </h1>
        </div>

        <button
          onClick={() => {
            setEditTarget(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          +    Nouveau protocole
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FREQUENCES.map((f) => {
          const s = FREQ_STYLES[f];
          const count = protocoles.filter(
            (p) => p.frequence === f
          ).length;

          const active = filterFreq === f;

          return (
            <button
              key={f}
              onClick={() =>
                setFilterFreq(active ? "ALL" : f)
              }
              className={`group rounded-xl border bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                active
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-200"
              }`}
            >
              <div
                className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}
              >
                <TimeIcon
                  className={`h-4 w-4 ${s.text}`}
                />
              </div>

              <p
                className={`text-xl font-bold ${s.text}`}
              >
                {count}
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase leading-tight tracking-wide text-slate-500">
                {f}
              </p>
            </button>
          );
        })}
      </div>

      {/* ================= SEARCH / FILTER ================= */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <DocsIcon className="h-4 w-4 text-blue-600" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
              Recherche & filtres
            </p>

            <p className="text-[11px] text-slate-400">
              Affinez la liste des protocoles
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Rechercher par nom, description, fréquence..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className={`${inputClass} mb-3`}
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterFreq("ALL")}
            className={`rounded-lg border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all ${
              filterFreq === "ALL"
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Toutes fréquences
          </button>

          {FREQUENCES.map((f) => (
            <button
              key={f}
              onClick={() =>
                setFilterFreq(
                  f === filterFreq ? "ALL" : f
                )
              }
              className={`rounded-lg border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all ${
                filterFreq === f
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ================= RESULT COUNT ================= */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-700">
            {filtered.length}
          </span>{" "}
          protocole
          {filtered.length !== 1 ? "s" : ""} affiché
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {(searchTerm || filterFreq !== "ALL") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterFreq("ALL");
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <DocsIcon className="h-5 w-5 text-slate-300" />
          </div>

          <p className="text-sm font-semibold text-slate-600">
            Aucun protocole trouvé
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      ) : (
        /* ================= PROTOCOL CARDS ================= */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const usage = getUsageCount(
              p.idProtocole
            );

            const produits = p.produits || [];

            const s =
              FREQ_STYLES[p.frequence] || {
                solid: "bg-slate-500",
                text: "text-slate-700",
                bg: "bg-slate-50",
                border: "border-slate-200",
              };

            return (
              <div
                key={p.idProtocole}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Card Header */}
                <div
                  className={`relative overflow-hidden px-4 py-3 ${s.solid}`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -right-5 -top-7 h-20 w-20 rounded-full bg-white/10" />
                  <div className="absolute -right-2 -bottom-8 h-16 w-16 rounded-full bg-white/5" />

                  <div className="relative flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                      <TimeIcon className="h-3.5 w-3.5" />
                      {p.frequence}
                    </span>

                    <span className="font-mono text-[10px] text-white/60">
                      #{p.idProtocole}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-3">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                      Protocole
                    </p>

                    <h3 className="text-sm font-bold text-slate-900">
                      {p.nomProtocole}
                    </h3>
                  </div>

                  <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {p.description}
                  </p>

                  {/* Products */}
                  {produits.length > 0 && (
                    <div className="mb-4">
                      <div className="mb-2 flex items-center gap-1.5">
                        <BoxIconLine className="h-3.5 w-3.5 text-slate-400" />

                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Produits associés
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {produits.map((prod) => (
                          <span
                            key={prod.idProduit}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600"
                          >
                            <BoxIconLine className="h-3 w-3 text-slate-400" />
                            {prod.nomProduit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage */}
                  <div className="mb-4 mt-auto flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                        <PieChartIcon className="h-3.5 w-3.5 text-blue-600" />
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Utilisations
                      </span>
                    </div>

                    <span className="text-sm font-bold text-slate-800">
                      {usage}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditTarget(p);
                        setIsModalOpen(true);
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                      Modifier
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(p.idProtocole)
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-50"
                    >
                      <TrashBinIcon className="h-3.5 w-3.5" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL ================= */}
      <ProtocoleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTarget(null);
        }}
        onSave={handleSave}
        loading={modalLoading}
        initial={editTarget}
      />
    </>
  );
}