import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import {
  personnelAPI,
  historiqueAPI,
  Personnel,
  HistoriqueLit,
} from "../../services/api";
import {
  BalaisIcon,
  CloseIcon,
  PencilIcon,
  TrashBinIcon,
  UserIcon,
} from "../../icons";

const QUALIFICATIONS = [
  "Responsable Nettoyage",
  "Superviseur",
  "Technicien Hygiène",
  "Agent Bionettoyage",
];

const QUAL_STYLES: Record<string, { solid: string; text: string }> = {
  "Responsable Nettoyage": {
    solid: "bg-blue-700",
    text: "text-blue-700",
  },
  Superviseur: {
    solid: "bg-slate-700",
    text: "text-slate-700",
  },
  "Technicien Hygiène": {
    solid: "bg-green-600",
    text: "text-green-700",
  },
  "Agent Bionettoyage": {
    solid: "bg-amber-500",
    text: "text-amber-700",
  },
};

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500";

const PersonnelModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Personnel, "idAgent">) => Promise<void>;
  loading: boolean;
  initial?: Personnel | null;
}) => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    qualification: QUALIFICATIONS[0],
  });

  useEffect(() => {
    if (initial) {
      setForm({
        nom: initial.nom,
        prenom: initial.prenom,
        qualification: initial.qualification,
      });
    } else {
      setForm({
        nom: "",
        prenom: "",
        qualification: QUALIFICATIONS[0],
      });
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.nom || !form.prenom || !form.qualification) {
      alert("Remplissez tous les champs");
      return;
    }

    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="mb-5 flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">
              Personnel
            </p>

            <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">
              {initial ? "Modifier l'agent" : "Nouvel agent"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {initial
                ? "Mettre à jour les informations"
                : "Ajouter un agent au personnel"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nom</label>

              <input
                type="text"
                value={form.nom}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nom: e.target.value,
                  }))
                }
                placeholder="Rousseau"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Prénom</label>

              <input
                type="text"
                value={form.prenom}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    prenom: e.target.value,
                  }))
                }
                placeholder="Thierry"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Qualification</label>

            <select
              value={form.qualification}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  qualification: e.target.value,
                }))
              }
              className={inputClass}
            >
              {QUALIFICATIONS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border border-slate-300 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 rounded-md bg-blue-700 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "..." : initial ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [historiques, setHistoriques] = useState<HistoriqueLit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Personnel | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterQual, setFilterQual] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [p, h] = await Promise.all([
          personnelAPI.getAll(),
          historiqueAPI.getAll(),
        ]);

        setPersonnel(p.data);
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

  const getOperationCount = (idAgent: number) =>
    historiques.filter((h) => h.idAgent === idAgent).length;

  const countByQual = (q: string) =>
    personnel.filter((p) => p.qualification === q).length;

  const filtered = personnel.filter((p) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !search ||
      p.nom.toLowerCase().includes(search) ||
      p.prenom.toLowerCase().includes(search) ||
      p.qualification.toLowerCase().includes(search);

    const matchesQual =
      filterQual === "ALL" || p.qualification === filterQual;

    return matchesSearch && matchesQual;
  });

  const handleSave = async (
    data: Omit<Personnel, "idAgent">
  ) => {
    try {
      setModalLoading(true);

      if (editTarget) {
        const res = await personnelAPI.update(
          editTarget.idAgent,
          data
        );

        setPersonnel((prev) =>
          prev.map((p) =>
            p.idAgent === editTarget.idAgent ? res.data : p
          )
        );
      } else {
        const res = await personnelAPI.create(data);

        setPersonnel((prev) => [...prev, res.data]);
      }

      setEditTarget(null);
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet agent ?")) return;

    try {
      await personnelAPI.delete(id);

      setPersonnel((prev) =>
        prev.filter((p) => p.idAgent !== id)
      );
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700" />
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Personnel | Bionettoyage"
        description="Gestion du personnel"
      />

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
            Personnel
          </h1>
        </div>

        <button
          onClick={() => {
            setEditTarget(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 rounded-md bg-blue-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-blue-800"
        >
          +    Nouvel agent
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUALIFICATIONS.map((q) => {
          const s = QUAL_STYLES[q];
          const active = filterQual === q;

          return (
            <button
              key={q}
              onClick={() =>
                setFilterQual(active ? "ALL" : q)
              }
              className={`group flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                active
                  ? "border-blue-600 ring-1 ring-blue-600"
                  : "border-slate-200"
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${s.solid} shadow-sm`}
              >
                <UserIcon className="h-4.5 w-4.5 text-white" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  {q}
                </p>

                <p
                  className={`mt-0.5 text-xl font-bold ${s.text}`}
                >
                  {countByQual(q)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= SEARCH / FILTER ================= */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${inputClass} mb-3`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterQual("ALL")}
            className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
              filterQual === "ALL"
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tous ({personnel.length})
          </button>

          {QUALIFICATIONS.map((q) => (
            <button
              key={q}
              onClick={() => setFilterQual(q)}
              className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                filterQual === q
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {q} ({countByQual(q)})
            </button>
          ))}
        </div>
      </div>

      {/* ================= RESULT COUNT ================= */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {filtered.length} agent
          {filtered.length !== 1 ? "s" : ""} affiché
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {filterQual !== "ALL" && (
          <button
            onClick={() => setFilterQual("ALL")}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Réinitialiser le filtre
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80">
            <tr>
              {[
                "#",
                "Nom",
                "Prénom",
                "Qualification",
                "Opérations",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-14 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <UserIcon className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-500">
                      Aucun agent trouvé
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier votre recherche ou vos filtres.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const s =
                  QUAL_STYLES[p.qualification] || {
                    solid: "bg-slate-500",
                    text: "text-slate-700",
                  };

                return (
                  <tr
                    key={p.idAgent}
                    className="transition-colors hover:bg-slate-50"
                  >
                    {/* ID */}
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">
                      #{p.idAgent}
                    </td>

                    {/* NOM */}
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {p.nom}
                    </td>

                    {/* PRENOM */}
                    <td className="px-4 py-3 text-slate-700">
                      {p.prenom}
                    </td>

                    {/* QUALIFICATION */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${s.solid}`}
                      >
                        {p.qualification}
                      </span>
                    </td>

                    {/* OPERATIONS */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        <BalaisIcon className="h-3.5 w-3.5" />
                        {getOperationCount(p.idAgent)}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditTarget(p);
                            setIsModalOpen(true);
                          }}
                          title="Modifier"
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(p.idAgent)
                          }
                          title="Supprimer"
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
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

      {/* ================= MODAL ================= */}
      <PersonnelModal
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