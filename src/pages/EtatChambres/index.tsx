import { useEffect, useState } from "react";

import PageMeta from "../../components/common/PageMeta";

import {
  litsAPI,
  chambresAPI,
  servicesAPI,
  personnelAPI,
  historiqueAPI,
  patientsAPI,
  protocolesAPI,
  Lit,
  Chambre,
  Service,
  Personnel,
  Patient,
  Protocole,
} from "../../services/api";

import {
  AppartementIcon,
  LitIcon,
  DortoirIcon,
  CheckCircleIcon,
  ControleAccesIcon,
  BalaisIcon,
  BouclierExclamationIcon,
  UserIcon,
  CartesViergesIcon,
  CloseIcon,
  BoxIconLine,
  PencilIcon,
} from "../../icons";

/* ============================================================
   SHARED DESIGN TOKENS (matches Services page)
============================================================ */

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500";

/* ============================================================
   STATUS CONFIG
============================================================ */

const STATUS: Record<
  number,
  {
    label: string;
    solid: string;
    text: string;
    light: string;
    border: string;
    icon: any;
  }
> = {
  1: {
    label: "Libre",
    solid: "bg-green-700",
    text: "text-emerald-700",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircleIcon,
  },
  2: {
    label: "Occupée",
    solid: "bg-amber-500",
    text: "text-amber-700",
    light: "bg-amber-50",
    border: "border-amber-200",
    icon: ControleAccesIcon,
  },
  3: {
    label: "En nettoyage",
    solid: "bg-blue-700",
    text: "text-blue-700",
    light: "bg-blue-50",
    border: "border-blue-200",
    icon: BalaisIcon,
  },
  4: {
    label: "Hors service",
    solid: "bg-[#B40001]",
    text: "text-rose-700",
    light: "bg-rose-50",
    border: "border-rose-200",
    icon: BouclierExclamationIcon,
  },
};

const ALLOWED_TRANSITIONS: Record<number, number[]> = {
  1: [3, 4],
  2: [1, 3, 4],
  3: [1, 2, 4],
  4: [3],
};

const TRANSITION_HINT: Record<string, string> = {
  "1-2": "Utilisez la page Séjours pour admettre un patient",
  "4-1": "Le lit doit d'abord être nettoyé",
  "4-2": "Le lit doit d'abord être nettoyé",
};

/* ============================================================
   ROOM CARD
============================================================ */

const RoomCard = ({
  lit,
  chambre,
  service,
  onChangeStatus,
}: {
  lit: Lit;
  chambre: Chambre | undefined;
  service: Service | undefined;
  onChangeStatus: (lit: Lit) => void;
}) => {
  const status = STATUS[lit.idEtat] || STATUS[1];
  const StatusIcon = status.icon;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      {/* HEADER */}
      <div className={`relative overflow-hidden ${status.solid} px-4 py-3.5 text-white`}>
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <StatusIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">État</p>
              <h2 className="text-sm font-bold">{status.label}</h2>
            </div>
          </div>
          <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80">
            #{lit.idLit}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-slate-400">
              <DortoirIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="truncate text-lg font-bold text-slate-900">{chambre?.numeroChambre || "?"}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Chambre</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-green-600">
              <LitIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="truncate text-lg font-bold text-green-700">{lit.numeroLit}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-green-700/60">Lit</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <AppartementIcon className="h-3.5 w-3.5 text-slate-400" />
          <p className="text-xs text-slate-500">
            {service?.numeroEtage || `Service ${chambre?.idEtage ?? "?"}`}
          </p>
        </div>

        <div className="mt-3 min-h-[54px] border-t border-slate-100 pt-3">
          {/* OCCUPIED */}
          {lit.idEtat === 2 && lit.nomPatient && (
            <div className={`flex items-center gap-2.5 rounded-lg border ${status.border} ${status.light} p-2.5`}>
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                <UserIcon className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Patient</p>
                <p className="truncate text-xs font-semibold text-slate-700">{lit.nomPatient}</p>
              </div>
            </div>
          )}

          {/* CLEANING */}
          {lit.idEtat === 3 && lit.nomAgent && (
            <div className={`flex items-center gap-2.5 rounded-lg border ${status.border} ${status.light} p-2.5`}>
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                <UserIcon className="h-3.5 w-3.5 text-blue-700" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Agent</p>
                <p className="truncate text-xs font-semibold text-slate-700">{lit.nomAgent}</p>
              </div>
            </div>
          )}

          {/* FREE */}
          {lit.idEtat === 1 && (
            <div className={`flex items-center gap-2.5 rounded-lg border ${status.border} ${status.light} p-2.5`}>
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-slate-600">Prêt à accueillir un patient</p>
            </div>
          )}

          {/* OUT OF SERVICE */}
          {lit.idEtat === 4 && (
            <div className={`flex items-center gap-2.5 rounded-lg border ${status.border} ${status.light} p-2.5`}>
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                <BouclierExclamationIcon className="h-3.5 w-3.5 text-rose-600" />
              </div>
              <p className="text-xs font-semibold text-rose-600">Intervention requise</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => onChangeStatus(lit)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-bold uppercase tracking-wide text-blue-700 transition hover:bg-blue-700 hover:text-white"
          >
            <PencilIcon className="h-3.5 w-3.5" /> Changer l'état
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   CHANGE STATUS MODAL
============================================================ */

const ChangeStatusModal = ({
  lit,
  isOpen,
  onClose,
  onStatusChange,
  loading,
  personnels,
  patients,
  protocoles,
  previousPatientId,
}: {
  lit: Lit | null;
  isOpen: boolean;
  onClose: () => void;

  onStatusChange: (
    litId: number,
    etatId: number,
    extra?: {
      idAgent?: number;
      idProtocole?: number;
      patient?: {
        mode: "existing";
        idPatient?: number;
      };
    }
  ) => Promise<void>;

  loading: boolean;
  personnels: Personnel[];
  patients: Patient[];
  protocoles: Protocole[];
  previousPatientId?: number;
}) => {
  const [step, setStep] = useState<"status" | "agent" | "patient">("status");

  const [selectedEtatId, setSelectedEtatId] = useState<number | null>(null);

  const [selectedAgentId, setSelectedAgentId] = useState("");

  const [selectedProtocoleId, setSelectedProtocoleId] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setStep("status");
    setSelectedEtatId(null);
    setSelectedAgentId("");
    setSelectedProtocoleId("");

    setSelectedPatientId(previousPatientId ? String(previousPatientId) : "");
  }, [isOpen, previousPatientId]);

  if (!isOpen || !lit) return null;

  /* ----------------------------------------------------------
     STATUS CLICK
  ---------------------------------------------------------- */

  const handleStatusClick = async (etatId: number) => {
    if (loading) return;

    /* Nettoyage */
    if (etatId === 3) {
      setSelectedEtatId(3);
      setStep("agent");
      return;
    }

    /* Réoccupation */
    if (etatId === 2) {
      if (lit.idEtat !== 3) {
        alert("Une chambre libre doit être occupée depuis la page Séjours.");
        return;
      }

      if (!previousPatientId) {
        alert("Impossible de retrouver le patient précédent pour ce lit.");
        return;
      }

      setSelectedEtatId(2);
      setSelectedPatientId(String(previousPatientId));
      setStep("patient");
      return;
    }

    /* Other transitions */
    try {
      await onStatusChange(lit.idLit, etatId);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  /* ----------------------------------------------------------
     CONFIRM CLEANING
  ---------------------------------------------------------- */

  const handleConfirmAgent = async () => {
    if (!selectedEtatId || !selectedAgentId) return;

    try {
      await onStatusChange(lit.idLit, selectedEtatId, {
        idAgent: parseInt(selectedAgentId),
        idProtocole: selectedProtocoleId ? parseInt(selectedProtocoleId) : undefined,
      });

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  /* ----------------------------------------------------------
     CONFIRM PATIENT
  ---------------------------------------------------------- */

  const handleConfirmPatient = async () => {
    if (lit.idEtat !== 3 || selectedEtatId !== 2) {
      alert("Cette action n'est pas autorisée.");
      return;
    }

    if (!previousPatientId) {
      alert("Aucun patient précédent n'est enregistré pour ce lit.");
      return;
    }

    if (!selectedPatientId) {
      alert("Sélectionnez le patient.");
      return;
    }

    const selectedId = parseInt(selectedPatientId);

    if (selectedId !== previousPatientId) {
      alert("Seul le patient qui occupait précédemment ce lit peut être réaffecté.");
      return;
    }

    try {
      await onStatusChange(lit.idLit, 2, {
        patient: {
          mode: "existing",
          idPatient: selectedId,
        },
      });

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const previousPatient = previousPatientId
    ? patients.find((p) => p.idPatient === previousPatientId)
    : undefined;

  /* ----------------------------------------------------------
     HEADER META PER STEP
  ---------------------------------------------------------- */

  const headerMeta =
    step === "status"
      ? { icon: LitIcon, title: "Changer l'état" }
      : step === "agent"
      ? { icon: BalaisIcon, title: "Nettoyage du lit" }
      : { icon: UserIcon, title: "Retour du patient" };

  const HeaderIcon = headerMeta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* HEADER */}
        <div className="bg-blue-700 px-5 py-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <HeaderIcon className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold">{headerMeta.title}</h2>
              <p className="mt-0.5 text-xs text-blue-100">
                Lit <span className="font-semibold text-white">{lit.numeroLit}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ===================================================
            STATUS STEP
        ==================================================== */}

        {step === "status" && (
          <div className="space-y-2 p-5">
            {Object.entries(STATUS).map(([id, status]) => {
              const targetId = parseInt(id);

              const isCurrent = lit.idEtat === targetId;

              const isAllowed = ALLOWED_TRANSITIONS[lit.idEtat]?.includes(targetId);

              const hint = TRANSITION_HINT[`${lit.idEtat}-${targetId}`];

              const Icon = status.icon;

              return (
                <div key={id}>
                  <button
                    type="button"
                    onClick={() => handleStatusClick(targetId)}
                    disabled={loading || isCurrent || !isAllowed}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-xs font-bold uppercase tracking-wide transition-all ${
                      isCurrent
                        ? `cursor-not-allowed border-transparent ${status.solid} text-white`
                        : !isAllowed
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300"
                        : `border-slate-200 bg-white ${status.text} hover:border-blue-200 hover:bg-slate-50`
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isCurrent ? "bg-white/20" : !isAllowed ? "bg-slate-100" : status.light
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{isCurrent ? `${status.label} (actuel)` : status.label}</span>
                  </button>

                  {!isCurrent && !isAllowed && hint && (
                    <p className="mt-1.5 pl-1 text-xs text-slate-400">{hint}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================
            CLEANING STEP
        ==================================================== */}

        {step === "agent" && (
          <div className="space-y-4 p-5">
            {/* AGENT */}
            <div>
              <label className={labelClass}>
                <UserIcon className="h-3.5 w-3.5 text-blue-700" /> Agent
              </label>

              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner un agent</option>

                {personnels.map((p) => (
                  <option key={p.idAgent} value={p.idAgent}>
                    {p.nom} {p.prenom} — {p.qualification}
                  </option>
                ))}
              </select>
            </div>

            {/* PROTOCOLE */}
            <div>
              <label className={labelClass}>
                <BoxIconLine className="h-3.5 w-3.5 text-blue-700" /> Protocole (optionnel)
              </label>

              <select
                value={selectedProtocoleId}
                onChange={(e) => setSelectedProtocoleId(e.target.value)}
                className={inputClass}
              >
                <option value="">Aucun protocole</option>

                {protocoles.map((p) => (
                  <option key={p.idProtocole} value={p.idProtocole}>
                    {p.nomProtocole}
                  </option>
                ))}
              </select>

              <p className="mt-1.5 text-xs text-slate-400">
                Les produits liés seront marqués « non disponible »
              </p>

              {/* PRODUCTS */}
              {selectedProtocoleId &&
                (() => {
                  const protocole = protocoles.find(
                    (p) => p.idProtocole === parseInt(selectedProtocoleId)
                  );

                  const produits = protocole?.produits || [];

                  if (!produits.length) {
                    return null;
                  }

                  const someUnavailable = produits.some((p) => !p.disponible);

                  return (
                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                        <BoxIconLine className="h-3.5 w-3.5" />
                        Produits utilisés
                      </p>

                      <ul className="space-y-2">
                        {produits.map((prod) => (
                          <li
                            key={prod.idProduit}
                            className="flex items-center justify-between text-sm text-slate-700"
                          >
                            <span>{prod.nomProduit}</span>

                            <span
                              className={`text-xs font-bold uppercase tracking-wide ${
                                prod.disponible ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {prod.disponible ? "Disponible" : "Non disponible"}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {someUnavailable && (
                        <p className="mt-2 text-xs font-semibold text-rose-600">
                          Certains produits sont déjà non disponibles
                        </p>
                      )}
                    </div>
                  );
                })()}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep("status")}
                className="flex-1 rounded-lg border border-slate-300 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
              >
                Retour
              </button>

              <button
                type="button"
                onClick={handleConfirmAgent}
                disabled={loading || !selectedAgentId}
                className="flex-1 rounded-lg bg-blue-700 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-40"
              >
                {loading ? "..." : "Confirmer"}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            PREVIOUS PATIENT STEP
        ==================================================== */}

        {step === "patient" && (
          <div className="space-y-4 p-5">
            {/* EXPLANATION */}
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <UserIcon className="h-4 w-4 text-amber-600" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                  Même patient uniquement
                </p>

                <p className="mt-1 text-xs leading-relaxed text-amber-700">
                  Ce lit était occupé par ce patient avant le nettoyage. Aucun nouveau séjour ne sera créé.
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <UserIcon className="h-3.5 w-3.5 text-blue-700" /> Patient précédent
              </label>

              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className={inputClass}
              >
                <option value="">Sélectionner le patient</option>

                {previousPatient && (
                  <option value={previousPatient.idPatient}>
                    {previousPatient.nom} {previousPatient.prenom}
                  </option>
                )}
              </select>
            </div>

            {!previousPatient && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-semibold text-rose-600">
                  Le patient précédent n'a pas pu être retrouvé.
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep("status")}
                className="flex-1 rounded-lg border border-slate-300 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
              >
                Retour
              </button>

              <button
                type="button"
                onClick={handleConfirmPatient}
                disabled={loading || !selectedPatientId || !previousPatientId}
                className="flex-1 rounded-lg bg-blue-700 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-40"
              >
                {loading ? "..." : "Confirmer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   MAIN PAGE
============================================================ */

export default function EtatChambres() {
  const [lits, setLits] = useState<Lit[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [protocoles, setProtocoles] = useState<Protocole[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterService, setFilterService] = useState("ALL");

  const [filterChambre, setFilterChambre] = useState("");

  const [filterLit, setFilterLit] = useState("ALL");

  const [filterEtat, setFilterEtat] = useState("ALL");

  const [selectedLit, setSelectedLit] = useState<Lit | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalLoading, setModalLoading] = useState(false);

  const [previousPatientByLit, setPreviousPatientByLit] = useState<Record<number, number>>({});

  /* ==========================================================
     LOAD DATA
  ========================================================== */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [
          litsResponse,
          chambresResponse,
          servicesResponse,
          personnelResponse,
          patientsResponse,
          protocolesResponse,
        ] = await Promise.all([
          litsAPI.getAll(),
          chambresAPI.getAll(),
          servicesAPI.getAll(),
          personnelAPI.getAll(),
          patientsAPI.getAll(),
          protocolesAPI.getAll(),
        ]);

        const litsData = litsResponse.data;
        const chambresData = chambresResponse.data;
        const servicesData = servicesResponse.data;
        const personnelsData = personnelResponse.data;
        const patientsData = patientsResponse.data;
        const protocolesData = protocolesResponse.data;

        setLits(litsData);
        setChambres(chambresData);
        setServices(servicesData);
        setPersonnels(personnelsData);
        setPatients(patientsData);
        setProtocoles(protocolesData);

        /* ----------------------------------------------
           RESTORE PREVIOUS PATIENTS
        ---------------------------------------------- */

        let savedPatients: Record<number, number> = {};

        try {
          const saved = localStorage.getItem("bionettoyage_previous_patient_by_lit");

          if (saved) {
            savedPatients = JSON.parse(saved);
          }
        } catch {
          savedPatients = {};
        }

        const reconstructed = {
          ...savedPatients,
        };

        litsData.forEach((lit: Lit) => {
          if (lit.idEtat === 2 && lit.nomPatient) {
            const normalizedName = lit.nomPatient.trim().toLowerCase();

            const matchingPatient = patientsData.find((patient: Patient) => {
              const fullName = `${patient.nom} ${patient.prenom}`.trim().toLowerCase();

              return fullName === normalizedName;
            });

            if (matchingPatient) {
              reconstructed[lit.idLit] = matchingPatient.idPatient;
            }
          }
        });

        setPreviousPatientByLit(reconstructed);

        localStorage.setItem(
          "bionettoyage_previous_patient_by_lit",
          JSON.stringify(reconstructed)
        );

        setError(null);
      } catch (err) {
        console.error(err);

        setError("Erreur lors du chargement. Vérifiez que le serveur Spring Boot est lancé.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ==========================================================
     HELPERS
  ========================================================== */

  const getChambre = (lit: Lit) => chambres.find((chambre) => chambre.idChambre === lit.idChambre);

  const getService = (chambre: Chambre | undefined) =>
    services.find((service) => service.idEtage === chambre?.idEtage);

  /* ==========================================================
     FILTERS
  ========================================================== */

  const filteredLits = lits.filter((lit) => {
    const chambre = getChambre(lit);

    if (filterService !== "ALL" && chambre?.idEtage !== parseInt(filterService)) {
      return false;
    }

    if (
      filterChambre &&
      !chambre?.numeroChambre?.toLowerCase().includes(filterChambre.toLowerCase())
    ) {
      return false;
    }

    if (filterLit !== "ALL" && lit.idLit !== parseInt(filterLit)) {
      return false;
    }

    if (filterEtat !== "ALL" && lit.idEtat !== parseInt(filterEtat)) {
      return false;
    }

    return true;
  });

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  lits.forEach((lit) => {
    if (counts[lit.idEtat] !== undefined) {
      counts[lit.idEtat]++;
    }
  });

  /* ==========================================================
     CHANGE STATUS
  ========================================================== */

  const handleChangeStatus = async (
    litId: number,
    etatId: number,
    extra?: {
      idAgent?: number;
      idProtocole?: number;
      patient?: {
        mode: "existing";
        idPatient?: number;
      };
    }
  ) => {
    try {
      setModalLoading(true);

      const currentLit = lits.find((lit) => lit.idLit === litId);

      if (!currentLit) return;

      /* ------------------------------------------------------
         CLEANING -> OCCUPIED
      ------------------------------------------------------ */

      if (etatId === 2 && currentLit.idEtat === 3) {
        const patientId = extra?.patient?.idPatient;

        const previousPatientId = previousPatientByLit[litId];

        if (!patientId) {
          alert("Sélectionnez le patient.");
          return;
        }

        if (!previousPatientId) {
          alert("Aucun patient précédent n'est enregistré pour ce lit.");
          return;
        }

        if (patientId !== previousPatientId) {
          alert("Ce lit ne peut être réoccupé que par le patient qui l'occupait avant le nettoyage.");
          return;
        }

        await litsAPI.changeState(litId, 2);

        const patient = patients.find((p) => p.idPatient === patientId);

        const patientLabel = patient
          ? `${patient.nom} ${patient.prenom}`
          : currentLit.nomPatient || "";

        setLits((prev) =>
          prev.map((lit) =>
            lit.idLit === litId
              ? {
                  ...lit,
                  idEtat: 2,
                  nomPatient: patientLabel,
                  nomAgent: undefined,
                }
              : lit
          )
        );

        return;
      }

      /* ------------------------------------------------------
         OCCUPIED -> CLEANING
      ------------------------------------------------------ */

      if (etatId === 3 && currentLit.idEtat === 2) {
        const patientName = currentLit.nomPatient;

        /* Save previous patient */
        if (patientName) {
          const normalizedName = patientName.trim().toLowerCase();

          const matchingPatient = patients.find((patient) => {
            const fullName = `${patient.nom} ${patient.prenom}`.trim().toLowerCase();

            return fullName === normalizedName;
          });

          if (matchingPatient) {
            const updatedMapping = {
              ...previousPatientByLit,
              [litId]: matchingPatient.idPatient,
            };

            setPreviousPatientByLit(updatedMapping);

            try {
              localStorage.setItem(
                "bionettoyage_previous_patient_by_lit",
                JSON.stringify(updatedMapping)
              );
            } catch {
              // Ignore localStorage errors
            }
          }
        }

        /* Change state */
        await litsAPI.changeState(litId, 3);

        /* Create history */
        if (extra?.idAgent) {
          const agent = personnels.find((p) => p.idAgent === extra.idAgent);

          const protocole = extra.idProtocole
            ? protocoles.find((p) => p.idProtocole === extra.idProtocole)
            : undefined;

          await historiqueAPI.create({
            dateOperation: new Date().toISOString().split("T")[0],

            typeOperation: "NETTOYAGE",

            observation:
              "Nettoyage assigné à " +
              (agent ? `${agent.nom} ${agent.prenom}` : "agent") +
              (protocole ? ` (${protocole.nomProtocole})` : ""),

            idLit: litId,

            idAgent: extra.idAgent,

            idProtocole: extra.idProtocole as any,
          });
        }

        const agent = extra?.idAgent
          ? personnels.find((p) => p.idAgent === extra.idAgent)
          : undefined;

        setLits((prev) =>
          prev.map((lit) =>
            lit.idLit === litId
              ? {
                  ...lit,
                  idEtat: 3,
                  nomAgent: agent ? `${agent.nom} ${agent.prenom}` : "",
                  nomPatient: undefined,
                }
              : lit
          )
        );

        return;
      }

      /* ------------------------------------------------------
         OTHER STATES
      ------------------------------------------------------ */

      await litsAPI.changeState(litId, etatId);

      setLits((prev) =>
        prev.map((lit) =>
          lit.idLit === litId
            ? {
                ...lit,
                idEtat: etatId,
                nomAgent: undefined,
                nomPatient: undefined,
              }
            : lit
        )
      );
    } catch (error) {
      console.error("Erreur changement état:", error);

      alert("Erreur lors du changement d'état");
    } finally {
      setModalLoading(false);
    }
  };

  /* ==========================================================
     LOADING / ERROR
  ========================================================== */

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-400">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-700">{error}</p>
      </div>
    );

  /* ==========================================================
     LITS DROPDOWN
  ========================================================== */

  const litsForDropdown =
    filterService !== "ALL"
      ? lits.filter((lit) => getChambre(lit)?.idEtage === parseInt(filterService))
      : lits;

  const hasActiveFilters =
    filterEtat !== "ALL" || filterService !== "ALL" || filterLit !== "ALL" || !!filterChambre;

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <PageMeta title="État des Chambres | Bionettoyage" description="État actuel des chambres" />

      {/* HEADER */}
      <div className="mb-5">
        <h1 className="text-lg font-bold tracking-tight text-slate-900">État des chambres</h1>
        <p className="mt-0.5 text-xs text-slate-400">
          Vue d'ensemble en temps réel de l'occupation des lits
        </p>
      </div>

      {/* STATS */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(STATUS).map(([id, status]) => {
          const Icon = status.icon;

          const isSelected = filterEtat === id;

          return (
            <button
              type="button"
              key={id}
              onClick={() => setFilterEtat(isSelected ? "ALL" : id)}
              className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                isSelected ? `${status.solid} border-transparent` : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`absolute -right-3 -top-3 h-12 w-12 rounded-full ${
                  isSelected ? "bg-white/10" : `${status.solid}/10`
                }`}
              />
              <div className="relative flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-sm ${
                    isSelected ? "bg-white/20" : status.solid
                  }`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p
                    className={`text-[11px] font-bold uppercase tracking-wide ${
                      isSelected ? "text-white/80" : status.text
                    }`}
                  >
                    {status.label}
                  </p>
                  <p className={`mt-0.5 text-xl font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                    {counts[parseInt(id)]}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>
              <AppartementIcon className="h-3.5 w-3.5 text-blue-700" /> Service
            </label>

            <select
              value={filterService}
              onChange={(e) => {
                setFilterService(e.target.value);
                setFilterLit("ALL");
                setFilterChambre("");
              }}
              className={inputClass}
            >
              <option value="ALL">Tous les services</option>

              {services.map((service) => (
                <option key={service.idEtage} value={service.idEtage}>
                  {service.numeroEtage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              <DortoirIcon className="h-3.5 w-3.5 text-blue-700" /> Chambre
            </label>

            <input
              type="text"
              placeholder="Ex : 101, 202..."
              value={filterChambre}
              onChange={(e) => setFilterChambre(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              <LitIcon className="h-3.5 w-3.5 text-blue-700" /> Lit
            </label>

            <select
              value={filterLit}
              onChange={(e) => {
                const value = e.target.value;

                setFilterLit(value);

                if (value !== "ALL") {
                  const lit = lits.find((l) => l.idLit === parseInt(value));

                  const chambre = lit ? getChambre(lit) : undefined;

                  setFilterChambre(chambre?.numeroChambre || "");
                } else {
                  setFilterChambre("");
                }
              }}
              className={inputClass}
            >
              <option value="ALL">Tous les lits</option>

              {litsForDropdown.map((lit) => (
                <option key={lit.idLit} value={lit.idLit}>
                  {lit.numeroLit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* STATE CHIPS */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <label className={labelClass}>
            <CartesViergesIcon className="h-3.5 w-3.5 text-blue-700" /> État
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterEtat("ALL")}
              className={`rounded-lg border px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition-all ${
                filterEtat === "ALL"
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Tous
            </button>

            {Object.entries(STATUS).map(([id, status]) => (
              <button
                type="button"
                key={id}
                onClick={() => setFilterEtat(id)}
                className={`rounded-lg border px-4 py-2 text-[10px] font-bold uppercase tracking-wide transition-all ${
                  filterEtat === id
                    ? `border-transparent ${status.solid} text-white`
                    : `border-slate-300 bg-white ${status.text} hover:bg-slate-50`
                }`}
              >
                {status.label} ({counts[parseInt(id)]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400">
          {filteredLits.length} lit{filteredLits.length !== 1 ? "s" : ""} trouvé
          {filteredLits.length !== 1 ? "s" : ""}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setFilterEtat("ALL");
              setFilterService("ALL");
              setFilterLit("ALL");
              setFilterChambre("");
            }}
            className="text-xs font-bold uppercase tracking-wide text-blue-700 transition hover:text-blue-800"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* CARDS */}
      {filteredLits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200">
            <LitIcon className="h-5 w-5 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-500">Aucun lit ne correspond à ces filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLits.map((lit) => {
            const chambre = getChambre(lit);

            const service = getService(chambre);

            return (
              <RoomCard
                key={lit.idLit}
                lit={lit}
                chambre={chambre}
                service={service}
                onChangeStatus={(selected) => {
                  setSelectedLit(selected);
                  setIsModalOpen(true);

                  document.body.classList.add("modal-open");
                }}
              />
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <ChangeStatusModal
        lit={selectedLit}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLit(null);

          document.body.classList.remove("modal-open");
        }}
        onStatusChange={handleChangeStatus}
        loading={modalLoading}
        personnels={personnels}
        patients={patients}
        protocoles={protocoles}
        previousPatientId={selectedLit ? previousPatientByLit[selectedLit.idLit] : undefined}
      />
    </>
  );
}