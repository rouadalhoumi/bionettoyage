import { useState, useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";

import {
  historiqueAPI,
  litsAPI,
  personnelAPI,
  protocolesAPI,
  chambresAPI,
  HistoriqueLit,
  Lit,
  Personnel,
  Protocole,
  Chambre,
} from "../../services/api";

import {
  CalenderIcon,
  CartesViergesIcon,
  LitIcon,
  UserIcon,
  DocsIcon,
  PageIcon,
  InfoIcon,
  TrashBinIcon,
  BoxIconLine,
  BalaisIcon,
  ShootingStarIcon,
  BouclierExclamationIcon,
  ListIcon,
} from "../../icons";

const TYPE: Record<
  string,
  {
    label: string;
    solid: string;
    text: string;
    icon: any;
  }
> = {
  NETTOYAGE: {
    label: "Nettoyage",
    solid: "bg-blue-600",
    text: "text-blue-700",
    icon: BalaisIcon,
  },
  DESINFECTION: {
    label: "Désinfection",
    solid: "bg-slate-700",
    text: "text-slate-700",
    icon: ShootingStarIcon,
  },
  MAINTENANCE: {
    label: "Maintenance",
    solid: "bg-red-600",
    text: "text-red-700",
    icon: BouclierExclamationIcon,
  },
  INSPECTION: {
    label: "Inspection",
    solid: "bg-amber-500",
    text: "text-amber-700",
    icon: ListIcon,
  },
};

const getType = (t: string) =>
  TYPE[t] || {
    label: t,
    solid: "bg-slate-500",
    text: "text-slate-700",
    icon: CartesViergesIcon,
  };

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Historique() {
  const [historiques, setHistoriques] = useState<HistoriqueLit[]>([]);
  const [lits, setLits] = useState<Lit[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [protocoles, setProtocoles] = useState<Protocole[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterAgent, setFilterAgent] = useState("ALL");

  // ───────────────────────────────────────────────────────────────────────────
  // Load data
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [h, l, p, pr, ch] = await Promise.all([
          historiqueAPI.getAll(),
          litsAPI.getAll(),
          personnelAPI.getAll(),
          protocolesAPI.getAll(),
          chambresAPI.getAll(),
        ]);

        setHistoriques(h.data);
        setLits(l.data);
        setPersonnels(p.data);
        setProtocoles(pr.data);
        setChambres(ch.data);

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

  const getLit = (idLit: number) =>
    lits.find((l) => l.idLit === idLit);

  const getChambre = (idChambre: number) =>
    chambres.find((c) => c.idChambre === idChambre);

  const getAgent = (idAgent: number) =>
    personnels.find((p) => p.idAgent === idAgent);

  const getProtocole = (idProtocole: number) =>
    protocoles.find((p) => p.idProtocole === idProtocole);

  // ───────────────────────────────────────────────────────────────────────────
  // Filters
  // ───────────────────────────────────────────────────────────────────────────

  const filtered = historiques
    .filter((h) => {
      const agent = getAgent(h.idAgent);
      const lit = getLit(h.idLit);
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        agent?.nom?.toLowerCase().includes(search) ||
        agent?.prenom?.toLowerCase().includes(search) ||
        lit?.numeroLit?.toLowerCase().includes(search) ||
        h.typeOperation?.toLowerCase().includes(search) ||
        h.observation?.toLowerCase().includes(search);

      const matchesType =
        filterType === "ALL" || h.typeOperation === filterType;

      const matchesAgent =
        filterAgent === "ALL" ||
        h.idAgent === parseInt(filterAgent);

      return matchesSearch && matchesType && matchesAgent;
    })
    .sort(
      (a, b) =>
        new Date(b.dateOperation).getTime() -
        new Date(a.dateOperation).getTime()
    );

  // ───────────────────────────────────────────────────────────────────────────
  // Delete
  // ───────────────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette opération ?")) return;

    try {
      await historiqueAPI.delete(id);

      setHistoriques((prev) =>
        prev.filter((h) => h.idHistorique !== id)
      );
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const countByType = (type: string) =>
    historiques.filter((h) => h.typeOperation === type).length;

  // ───────────────────────────────────────────────────────────────────────────
  // Loading
  // ───────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-400">
            Chargement de l'historique...
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
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-100">
            <InfoIcon className="h-4 w-4 text-red-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-700">
              Impossible de charger l'historique
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <>
      <PageMeta
        title="Historique | Bionettoyage"
        description="Historique des opérations de nettoyage"
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Historique des opérations
        </h1>
      </div>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Object.entries(TYPE).map(([key, type]) => {
          const Icon = type.icon;

          return (
            <div
              key={key}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${type.solid} shadow-sm`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {type.label}
                  </p>

                  <p className={`mt-0.5 text-xl font-bold ${type.text}`}>
                    {countByType(key)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <ListIcon className="h-4 w-4 text-blue-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Filtres
            </p>

            <p className="text-[11px] text-slate-400">
              Affinez les opérations affichées
            </p>
          </div>
        </div>

        {/* Search + Agent */}
        <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Agent */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <UserIcon className="h-3.5 w-3.5" />
              Agent
            </label>

            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">Tous les agents</option>

              {personnels.map((p) => (
                <option key={p.idAgent} value={p.idAgent}>
                  {p.nom} {p.prenom}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <ListIcon className="h-3.5 w-3.5" />
              Recherche
            </label>

            <input
              type="text"
              placeholder="Agent, lit, type, observation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Operation Type */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <CartesViergesIcon className="h-3.5 w-3.5" />
            Type d'opération
          </label>

          <div className="flex flex-wrap gap-2">
            {/* All */}
            <button
              onClick={() => setFilterType("ALL")}
              className={`rounded-lg border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                filterType === "ALL"
                  ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              Tous
            </button>

            {Object.entries(TYPE).map(([key, type]) => {
              const Icon = type.icon;

              return (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                    filterType === key
                      ? `border-transparent ${type.solid} text-white shadow-sm`
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {type.label}
                  <span className="opacity-70">
                    ({countByType(key)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-600">
            {filtered.length}
          </span>{" "}
          opération{filtered.length !== 1 ? "s" : ""} trouvée
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {(searchTerm || filterType !== "ALL" || filterAgent !== "ALL") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("ALL");
              setFilterAgent("ALL");
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
          <table className="w-full min-w-[1150px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {[
                  { icon: null, label: "#" },
                  { icon: CalenderIcon, label: "Date" },
                  { icon: CartesViergesIcon, label: "Type" },
                  { icon: LitIcon, label: "Lit" },
                  { icon: null, label: "Chambre" },
                  { icon: UserIcon, label: "Agent" },
                  { icon: DocsIcon, label: "Protocole" },
                  { icon: BoxIconLine, label: "Produits" },
                  { icon: PageIcon, label: "Observation" },
                  { icon: null, label: "" },
                ].map((header, index) => {
                  const HeaderIcon = header.icon;

                  return (
                    <th
                      key={index}
                      className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500"
                    >
                      <span className="flex items-center gap-1.5">
                        {HeaderIcon && (
                          <HeaderIcon className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        {header.label}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                      <PageIcon className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Aucune opération trouvée
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Essayez de modifier vos filtres ou votre recherche.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((h) => {
                  const lit = getLit(h.idLit);
                  const chambre = getChambre(lit?.idChambre || 0);
                  const agent = getAgent(h.idAgent);
                  const protocole = getProtocole(h.idProtocole);
                  const produits = protocole?.produits || [];
                  const type = getType(h.typeOperation);

                  return (
                    <tr
                      key={h.idHistorique}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      {/* ID */}
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-400">
                        #{h.idHistorique}
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">
                        <div className="font-medium">
                          {new Date(h.dateOperation).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {new Date(h.dateOperation).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${type.solid}`}
                        >
                          {(() => {
                            const Icon = type.icon;
                            return <Icon className="h-3 w-3" />;
                          })()}

                          {h.typeOperation}
                        </span>
                      </td>

                      {/* Lit */}
                      <td className="px-4 py-3.5 font-mono text-sm font-medium text-slate-700">
                        {lit?.numeroLit || "—"}
                      </td>

                      {/* Chambre */}
                      <td className="px-4 py-3.5 text-slate-500">
                        {chambre?.numeroChambre || "—"}
                      </td>

                      {/* Agent */}
                      <td className="px-4 py-3.5">
                        {agent ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                              <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                            </div>

                            <span className="font-medium text-slate-800">
                              {agent.nom} {agent.prenom}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Protocole */}
                      <td className="px-4 py-3.5">
                        {protocole ? (
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                              <DocsIcon className="h-3.5 w-3.5 text-slate-500" />
                            </div>

                            <span className="max-w-[150px] truncate text-xs font-medium text-slate-600">
                              {protocole.nomProtocole}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Produits */}
                      <td className="px-4 py-3.5">
                        {produits.length > 0 ? (
                          <div className="flex max-w-[200px] flex-wrap gap-1">
                            {produits.map((prod) => (
                              <span
                                key={prod.idProduit}
                                className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
                              >
                                {prod.nomProduit}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Observation */}
                      <td
                        className="max-w-xs truncate px-4 py-3.5 text-xs text-slate-400"
                        title={h.observation}
                      >
                        {h.observation || "—"}
                      </td>

                      {/* Delete */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleDelete(h.idHistorique)}
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                          title="Supprimer"
                        >
                          <TrashBinIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}