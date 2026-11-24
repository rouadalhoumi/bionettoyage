import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { produitsAPI, protocolesAPI, Produit } from "../../services/api";
import {
  BoxCubeIcon,
  CheckCircleIcon,
  ErrorIcon,
  PencilIcon,
  TrashBinIcon,
  CloseIcon,
} from "../../icons";

const TYPES = [
  "Liquide",
  "Spray",
  "Poudre",
  "Gel",
  "Équipement",
];

const TYPE_STYLES: Record<string, string> = {
  Liquide: "bg-blue-700",
  Spray: "bg-slate-700",
  Poudre: "bg-amber-500",
  Gel: "bg-green-600",
  Équipement: "bg-slate-500",
};

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500";

const ProduitModal = ({
  isOpen,
  onClose,
  onSave,
  loading,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Produit, "idProduit">) => Promise<void>;
  loading: boolean;
  initial?: Produit | null;
}) => {
  const [form, setForm] = useState({
    nomProduit: "",
    typeProduit: TYPES[0],
    disponible: true,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        nomProduit: initial.nomProduit,
        typeProduit: initial.typeProduit,
        disponible: initial.disponible,
      });
    } else {
      setForm({
        nomProduit: "",
        typeProduit: TYPES[0],
        disponible: true,
      });
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.nomProduit || !form.typeProduit) {
      alert("Remplissez tous les champs obligatoires");
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
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Gestion des produits
            </p>

            <h2 className="text-base font-bold uppercase tracking-wide text-slate-900">
              {initial ? "Modifier produit" : "Nouveau produit"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {initial
                ? "Mettre à jour les informations"
                : "Ajouter un nouveau produit"}
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
          <div>
            <label className={labelClass}>
              Nom du produit
            </label>

            <input
              type="text"
              value={form.nomProduit}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  nomProduit: e.target.value,
                }))
              }
              placeholder="Ex: Désinfectant Surface"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Type</label>

            <select
              value={form.typeProduit}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  typeProduit: e.target.value,
                }))
              }
              className={inputClass}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Disponibilité
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    disponible: true,
                  }))
                }
                className={`flex items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                  form.disponible
                    ? "bg-green-600 text-white shadow-sm"
                    : "border border-slate-300 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <CheckCircleIcon className="h-4 w-4" />
                Disponible
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    disponible: false,
                  }))
                }
                className={`flex items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                  !form.disponible
                    ? "bg-red-600 text-white shadow-sm"
                    : "border border-slate-300 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <ErrorIcon className="h-4 w-4" />
                Non disponible
              </button>
            </div>
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

export default function Produits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [nbProtocoles, setNbProtocoles] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Produit | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterDispo, setFilterDispo] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await produitsAPI.getAll();

        setProduits(res.data);

        const resProto = await protocolesAPI.getAll();
        setNbProtocoles(resProto.data.length);

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

  const filtered = produits.filter((p) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      !search ||
      p.nomProduit.toLowerCase().includes(search) ||
      p.typeProduit.toLowerCase().includes(search);

    const matchesType =
      filterType === "ALL" ||
      p.typeProduit === filterType;

    const matchesDispo =
      filterDispo === "ALL" ||
      (filterDispo === "OUI"
        ? p.disponible
        : !p.disponible);

    return (
      matchesSearch &&
      matchesType &&
      matchesDispo
    );
  });

  const handleSave = async (
    data: Omit<Produit, "idProduit">
  ) => {
    try {
      setModalLoading(true);

      if (editTarget) {
        const res = await produitsAPI.update(
          editTarget.idProduit,
          data
        );

        setProduits((prev) =>
          prev.map((p) =>
            p.idProduit === editTarget.idProduit
              ? res.data
              : p
          )
        );
      } else {
        const res = await produitsAPI.create(data);

        setProduits((prev) => [...prev, res.data]);
      }

      setEditTarget(null);
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleDispo = async (
    produit: Produit
  ) => {
    try {
      const res = await produitsAPI.update(
        produit.idProduit,
        {
          ...produit,
          disponible: !produit.disponible,
        }
      );

      setProduits((prev) =>
        prev.map((p) =>
          p.idProduit === produit.idProduit
            ? res.data
            : p
        )
      );
    } catch {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;

    try {
      await produitsAPI.delete(id);

      setProduits((prev) =>
        prev.filter((p) => p.idProduit !== id)
      );
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const dispoCount = produits.filter(
    (p) => p.disponible
  ).length;

  const nonDispoCount = produits.filter(
    (p) => !p.disponible
  ).length;

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
        <p className="text-sm font-semibold text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Produits | Bionettoyage"
        description="Gestion des produits de nettoyage"
      />

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
            Produits
          </h1>
        </div>

        <button
          onClick={() => {
            setEditTarget(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 rounded-md bg-blue-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-blue-800"
        >
          +   Nouveau produit
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        {/* Total */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700 shadow-sm">
            <BoxCubeIcon className="h-4.5 w-4.5 text-white" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {produits.length}
            </p>
          </div>
        </div>

        {/* Protocoles */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-700 shadow-sm">
            <BoxIconLine className="h-4.5 w-4.5 text-white" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Protocoles
            </p>

            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {nbProtocoles}
            </p>
          </div>
        </div>

        {/* Disponibles */}
        <button
          onClick={() =>
            setFilterDispo(
              filterDispo === "OUI" ? "ALL" : "OUI"
            )
          }
          className={`flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
            filterDispo === "OUI"
              ? "border-green-600 ring-1 ring-green-600"
              : "border-slate-200"
          }`}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-600 shadow-sm">
            <CheckCircleIcon className="h-4.5 w-4.5 text-white" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Disponibles
            </p>

            <p className="mt-0.5 text-xl font-bold text-green-700">
              {dispoCount}
            </p>
          </div>
        </button>

        {/* Non disponibles */}
        <button
          onClick={() =>
            setFilterDispo(
              filterDispo === "NON" ? "ALL" : "NON"
            )
          }
          className={`flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
            filterDispo === "NON"
              ? "border-red-600 ring-1 ring-red-600"
              : "border-slate-200"
          }`}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 shadow-sm">
            <ErrorIcon className="h-4.5 w-4.5 text-white" />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Non disponibles
            </p>

            <p className="mt-0.5 text-xl font-bold text-red-700">
              {nonDispoCount}
            </p>
          </div>
        </button>
      </div>

      {/* ================= SEARCH / FILTER ================= */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative mb-3">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
              />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Rechercher par nom ou type..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className={`${inputClass} pl-10`}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
              filterType === "ALL"
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Tous types
          </button>

          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() =>
                setFilterType(
                  t === filterType ? "ALL" : t
                )
              }
              className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                filterType === t
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ================= RESULT COUNT ================= */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {filtered.length} produit
          {filtered.length !== 1 ? "s" : ""} affiché
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {(filterType !== "ALL" ||
          filterDispo !== "ALL" ||
          searchTerm) && (
          <button
            onClick={() => {
              setFilterType("ALL");
              setFilterDispo("ALL");
              setSearchTerm("");
            }}
            className="text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Réinitialiser les filtres
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
                "Type",
                "Disponibilité",
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
                  colSpan={5}
                  className="px-6 py-14 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <BoxCubeIcon className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-500">
                      Aucun produit trouvé
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier votre recherche ou vos filtres.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.idProduit}
                  className="transition-colors hover:bg-slate-50"
                >
                  {/* ID */}
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-400">
                    #{p.idProduit}
                  </td>

                  {/* NOM */}
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {p.nomProduit}
                  </td>

                  {/* TYPE */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${
                        TYPE_STYLES[p.typeProduit] ||
                        "bg-slate-500"
                      }`}
                    >
                      {p.typeProduit}
                    </span>
                  </td>

                  {/* DISPONIBILITE */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        handleToggleDispo(p)
                      }
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm transition-colors ${
                        p.disponible
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {p.disponible ? (
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                      ) : (
                        <ErrorIcon className="h-3.5 w-3.5" />
                      )}

                      {p.disponible
                        ? "Disponible"
                        : "Non disponible"}
                    </button>
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
                          handleDelete(p.idProduit)
                        }
                        title="Supprimer"
                        className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashBinIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      <ProduitModal
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