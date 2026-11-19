import { useState, useEffect } from "react";

import PageMeta from "../../components/common/PageMeta";

import {
  sejoursAPI,
  patientsAPI,
  litsAPI,
  chambresAPI,
  Sejour,
  Patient,
  Lit,
  Chambre,
} from "../../services/api";

import {
  AlertIcon,
  CloseIcon,
  UserIcon,
  CalenderIcon,
  LitIcon,
  DortoirIcon,
  CartesViergesIcon,
  ControleAccesIcon,
  TrashBinIcon,
} from "../../icons";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500";

/* =========================================================
   ADD SEJOUR MODAL
========================================================= */

const AddSejourModal = ({
  isOpen,
  onClose,
  onAdd,
  loading,
  lits,
  patients,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    patient: Omit<Patient, "idPatient">;
    sejour: {
      numFiche: number;
      idLit: number;
      dateAdmission: string;
    };
  }) => Promise<void>;
  loading: boolean;
  lits: Lit[];
  patients: Patient[];
}) => {
  const [step, setStep] = useState<"patient" | "sejour">(
    "patient"
  );

  const [useExistingPatient, setUseExistingPatient] =
    useState(false);

  const [selectedPatientId, setSelectedPatientId] =
    useState<string>("");

  const [patientForm, setPatientForm] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    sexe: "M",
  });

  const [sejourForm, setSejourForm] = useState({
    numFiche: "",
    idLit: "",
    dateAdmission: new Date()
      .toISOString()
      .split("T")[0],
  });

  useEffect(() => {
    if (isOpen) {
      setStep("patient");
      setUseExistingPatient(false);
      setSelectedPatientId("");

      setPatientForm({
        nom: "",
        prenom: "",
        dateNaissance: "",
        sexe: "M",
      });

      setSejourForm({
        numFiche: "",
        idLit: "",
        dateAdmission: new Date()
          .toISOString()
          .split("T")[0],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (
      !sejourForm.idLit ||
      !sejourForm.numFiche ||
      !sejourForm.dateAdmission
    ) {
      alert("Remplissez tous les champs du séjour");
      return;
    }

    let patientData = patientForm;

    if (useExistingPatient && selectedPatientId) {
      const existing = patients.find(
        (p) =>
          p.idPatient === parseInt(selectedPatientId)
      );

      if (existing) {
        patientData = existing;
      }
    }

    await onAdd({
      patient: patientData,
      sejour: {
        numFiche: parseInt(sejourForm.numFiche),
        idLit: parseInt(sejourForm.idLit),
        dateAdmission: sejourForm.dateAdmission,
      },
    });
  };

  const freeLits = lits.filter(
    (l) => l.idEtat === 1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              Admissions
            </p>

            <h2 className="text-lg font-bold text-slate-900">
              Nouveau séjour
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Enregistrement d'un patient et de son séjour
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2">
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${
                step === "patient"
                  ? "bg-blue-600"
                  : "bg-blue-600"
              }`}
            />

            <div
              className={`h-1 flex-1 rounded-full transition-colors ${
                step === "sejour"
                  ? "bg-blue-600"
                  : "bg-slate-200"
              }`}
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setStep("patient")}
              className={`flex-1 rounded-xl border py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-all ${
                step === "patient"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              1. Patient
            </button>

            <button
              onClick={() => setStep("sejour")}
              className={`flex-1 rounded-xl border py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-all ${
                step === "sejour"
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              2. Séjour
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6">
          {step === "patient" && (
            <div className="space-y-5">
              {/* Patient mode */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
                      Patient
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Informations du patient
                    </p>
                  </div>
                </div>
              </div>

              {/* Existing / new */}
              

              {useExistingPatient ? (
                <div>
                  <label className={labelClass}>
                    <UserIcon className="h-3.5 w-3.5 text-blue-600" />
                    Sélectionner un patient
                  </label>

                  <select
                    value={selectedPatientId}
                    onChange={(e) =>
                      setSelectedPatientId(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Choisir un patient
                    </option>

                    {patients.map((p) => (
                      <option
                        key={p.idPatient}
                        value={p.idPatient}
                      >
                        {p.nom} {p.prenom}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>
                        Nom
                      </label>

                      <input
                        type="text"
                        value={patientForm.nom}
                        onChange={(e) =>
                          setPatientForm((p) => ({
                            ...p,
                            nom: e.target.value,
                          }))
                        }
                        placeholder="Dupont"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Prénom
                      </label>

                      <input
                        type="text"
                        value={patientForm.prenom}
                        onChange={(e) =>
                          setPatientForm((p) => ({
                            ...p,
                            prenom: e.target.value,
                          }))
                        }
                        placeholder="Jean"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <CalenderIcon className="h-3.5 w-3.5 text-blue-600" />
                      Date de naissance
                    </label>

                    <input
                      type="date"
                      value={patientForm.dateNaissance}
                      onChange={(e) =>
                        setPatientForm((p) => ({
                          ...p,
                          dateNaissance:
                            e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Sexe
                    </label>

                    <select
                      value={patientForm.sexe}
                      onChange={(e) =>
                        setPatientForm((p) => ({
                          ...p,
                          sexe: e.target.value,
                        }))
                      }
                      className={inputClass}
                    >
                      <option value="M">
                        Masculin
                      </option>

                      <option value="F">
                        Féminin
                      </option>
                    </select>
                  </div>
                </>
              )}

              <button
                onClick={() => setStep("sejour")}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                Suivant
              </button>
            </div>
          )}

          {step === "sejour" && (
            <div className="space-y-5">
              {/* Stay information header */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <LitIcon className="h-4 w-4 text-blue-600" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Séjour
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Informations d'admission
                  </p>
                </div>
              </div>

              {/* Num fiche */}
              <div>
                <label className={labelClass}>
                  N° Fiche
                </label>

                <input
                  type="number"
                  value={sejourForm.numFiche}
                  onChange={(e) =>
                    setSejourForm((s) => ({
                      ...s,
                      numFiche: e.target.value,
                    }))
                  }
                  placeholder="Ex: 2001"
                  className={`${inputClass} font-mono`}
                />
              </div>

              {/* Bed */}
              <div>
                <label className={labelClass}>
                  <LitIcon className="h-3.5 w-3.5 text-blue-600" />
                  Lit disponible
                </label>

                <select
                  value={sejourForm.idLit}
                  onChange={(e) =>
                    setSejourForm((s) => ({
                      ...s,
                      idLit: e.target.value,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="">
                    Choisir un lit libre
                  </option>

                  {freeLits.map((l) => (
                    <option
                      key={l.idLit}
                      value={l.idLit}
                    >
                      {l.numeroLit}
                    </option>
                  ))}
                </select>

                {freeLits.length === 0 && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                    <AlertIcon className="h-3.5 w-3.5 text-red-600" />

                    <p className="text-xs font-medium text-red-600">
                      Aucun lit disponible
                    </p>
                  </div>
                )}
              </div>

              {/* Admission date */}
              <div>
                <label className={labelClass}>
                  <CalenderIcon className="h-3.5 w-3.5 text-blue-600" />
                  Date d'admission
                </label>

                <input
                  type="date"
                  value={sejourForm.dateAdmission}
                  onChange={(e) =>
                    setSejourForm((s) => ({
                      ...s,
                      dateAdmission:
                        e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep("patient")}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Retour
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading
                    ? "Enregistrement..."
                    : "Enregistrer"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Sejours() {
  const [sejours, setSejours] = useState<Sejour[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [lits, setLits] = useState<Lit[]>([]);
  const [chambres, setChambres] = useState<Chambre[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [modalLoading, setModalLoading] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState<
      "ALL" | "EN_COURS" | "SORTIE"
    >("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [sej, pat, lit, ch] =
          await Promise.all([
            sejoursAPI.getAll(),
            patientsAPI.getAll(),
            litsAPI.getAll(),
            chambresAPI.getAll(),
          ]);

        setSejours(sej.data);
        setPatients(pat.data);
        setLits(lit.data);
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

  const getPatient = (idPatient: number) =>
    patients.find(
      (p) => p.idPatient === idPatient
    );

  const getLit = (idLit: number) =>
    lits.find((l) => l.idLit === idLit);

  const getChambre = (idChambre: number) =>
    chambres.find(
      (c) => c.idChambre === idChambre
    );

  const filteredSejours = sejours.filter(
    (s) => {
      const patient = getPatient(s.idPatient);
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        patient?.nom
          .toLowerCase()
          .includes(search) ||
        patient?.prenom
          .toLowerCase()
          .includes(search) ||
        s.numFiche
          ?.toString()
          .includes(search);

      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "EN_COURS" &&
          !s.dateSortie) ||
        (filterStatus === "SORTIE" &&
          !!s.dateSortie);

      return matchesSearch && matchesStatus;
    }
  );

  const handleAdd = async (data: {
    patient: Omit<Patient, "idPatient">;
    sejour: {
      numFiche: number;
      idLit: number;
      dateAdmission: string;
    };
  }) => {
    try {
      setModalLoading(true);

      const patRes =
        await patientsAPI.create(data.patient);

      const newPatient = patRes.data;

      const sejRes =
        await sejoursAPI.create({
          numFiche: data.sejour.numFiche,
          idPatient: newPatient.idPatient,
          idLit: data.sejour.idLit,
          dateAdmission:
            data.sejour.dateAdmission,
        });

      setPatients((prev) => [
        ...prev,
        newPatient,
      ]);

      setSejours((prev) => [
        ...prev,
        sejRes.data,
      ]);

      await litsAPI.changeState(
        data.sejour.idLit,
        2
      );

      setLits((prev) =>
        prev.map((l) =>
          l.idLit === data.sejour.idLit
            ? {
                ...l,
                idEtat: 2,
                nomPatient: `${newPatient.nom} ${newPatient.prenom}`,
              }
            : l
        )
      );

      setIsModalOpen(false);
      document.body.classList.remove(
        "modal-open"
      );
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (
    idSejour: number
  ) => {
    if (!confirm("Supprimer ce séjour ?"))
      return;

    try {
      await sejoursAPI.delete(idSejour);

      setSejours((prev) =>
        prev.filter(
          (s) => s.idSejour !== idSejour
        )
      );
    } catch {
      alert("Erreur lors de la suppression");
    }
  };

  const enCours = sejours.filter(
    (s) => !s.dateSortie
  ).length;

  const sortis = sejours.filter(
    (s) => !!s.dateSortie
  ).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="text-xs font-medium text-slate-400">
            Chargement des séjours...
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
        title="Séjours | Bionettoyage"
        description="Gestion des séjours patients"
      />

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Séjours
          </h1>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            document.body.classList.add(
              "modal-open"
            );
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
        >
          <span className="text-lg font-medium leading-none">
            +
          </span>
          Nouveau séjour
        </button>
      </div>

      {/* ================= STATS ================= */}

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Total */}
        <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <CartesViergesIcon className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="text-xl font-bold text-slate-900">
              {sejours.length}
            </p>
          </div>
        </div>

        {/* En cours */}
        <button
          onClick={() =>
            setFilterStatus(
              filterStatus === "EN_COURS"
                ? "ALL"
                : "EN_COURS"
            )
          }
          className={`group flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
            filterStatus === "EN_COURS"
              ? "border-amber-400 ring-2 ring-amber-100"
              : "border-slate-200"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <ControleAccesIcon className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              En cours
            </p>

            <p className="text-xl font-bold text-amber-600">
              {enCours}
            </p>
          </div>
        </button>

        {/* Sortis */}
        <button
          onClick={() =>
            setFilterStatus(
              filterStatus === "SORTIE"
                ? "ALL"
                : "SORTIE"
            )
          }
          className={`group flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
            filterStatus === "SORTIE"
              ? "border-green-400 ring-2 ring-green-100"
              : "border-slate-200"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
            <span className="text-lg font-bold leading-none text-green-600">
              ✓
            </span>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Sortis
            </p>

            <p className="text-xl font-bold text-green-600">
              {sortis}
            </p>
          </div>
        </button>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <UserIcon className="h-4 w-4 text-blue-600" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
              Recherche & filtres
            </p>

            <p className="text-[11px] text-slate-400">
              Recherchez un séjour ou filtrez par statut
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou n° fiche..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className={`${inputClass} flex-1`}
          />

          <div className="flex flex-wrap gap-2">
            {(
              ["ALL", "EN_COURS", "SORTIE"] as const
            ).map((f) => (
              <button
                key={f}
                onClick={() =>
                  setFilterStatus(f)
                }
                className={`rounded-lg border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-all ${
                  filterStatus === f
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f === "ALL"
                  ? "Tous"
                  : f === "EN_COURS"
                  ? "En cours"
                  : "Sortis"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RESULT COUNT ================= */}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          <span className="font-semibold text-slate-700">
            {filteredSejours.length}
          </span>{" "}
          séjour
          {filteredSejours.length !== 1
            ? "s"
            : ""}{" "}
          affiché
          {filteredSejours.length !== 1
            ? "s"
            : ""}
        </p>

        {(searchTerm ||
          filterStatus !== "ALL") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("ALL");
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {[
                  {
                    icon: null,
                    label: "N° Fiche",
                  },
                  {
                    icon: UserIcon,
                    label: "Patient",
                  },
                  {
                    icon: null,
                    label: "Sexe",
                  },
                  {
                    icon: CalenderIcon,
                    label: "Naissance",
                  },
                  {
                    icon: CalenderIcon,
                    label: "Admission",
                  },
                  {
                    icon: CalenderIcon,
                    label: "Sortie",
                  },
                  {
                    icon: LitIcon,
                    label: "Lit",
                  },
                  {
                    icon: DortoirIcon,
                    label: "Chambre",
                  },
                  {
                    icon: null,
                    label: "Statut",
                  },
                  {
                    icon: null,
                    label: "",
                  },
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500"
                  >
                    <span className="flex items-center gap-1.5">
                      {h.icon && (
                        <h.icon className="h-3.5 w-3.5 text-slate-400" />
                      )}

                      {h.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSejours.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50">
                        <UserIcon className="h-5 w-5 text-slate-300" />
                      </div>

                      <p className="text-sm font-semibold text-slate-600">
                        Aucun séjour trouvé
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Essayez de modifier vos critères de recherche.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSejours.map(
                  (sejour) => {
                    const patient = getPatient(
                      sejour.idPatient
                    );

                    const lit = getLit(
                      sejour.idLit
                    );

                    const chambre =
                      getChambre(
                        lit?.idChambre || 0
                      );

                    const isEnCours =
                      !sejour.dateSortie;

                    return (
                      <tr
                        key={sejour.idSejour}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        {/* N° Fiche */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-bold text-blue-600">
                            #{sejour.numFiche}
                          </span>
                        </td>

                        {/* Patient */}
                        <td className="px-4 py-3.5">
                          {patient ? (
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                <UserIcon className="h-4 w-4 text-blue-600" />
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {patient.nom}{" "}
                                  {patient.prenom}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                  Patient
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300">
                              —
                            </span>
                          )}
                        </td>

                        {/* Sexe */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex min-w-[28px] justify-center rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                            {patient?.sexe === "M" ||
                            patient?.sexe ===
                              "MASCULIN"
                              ? "M"
                              : "F"}
                          </span>
                        </td>

                        {/* Naissance */}
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {patient?.dateNaissance
                            ? new Date(
                                patient.dateNaissance
                              ).toLocaleDateString(
                                "fr-FR"
                              )
                            : "—"}
                        </td>

                        {/* Admission */}
                        <td className="px-4 py-3.5 text-xs font-medium text-slate-600">
                          {new Date(
                            sejour.dateAdmission
                          ).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>

                        {/* Sortie */}
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {sejour.dateSortie
                            ? new Date(
                                sejour.dateSortie
                              ).toLocaleDateString(
                                "fr-FR"
                              )
                            : "—"}
                        </td>

                        {/* Lit */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700">
                            <LitIcon className="h-3 w-3 text-slate-400" />
                            {lit?.numeroLit || "—"}
                          </span>
                        </td>

                        {/* Chambre */}
                        <td className="px-4 py-3.5 text-xs font-medium text-slate-500">
                          {chambre?.numeroChambre ||
                            "—"}
                        </td>

                        {/* Statut */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                              isEnCours
                                ? "bg-amber-50 text-amber-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isEnCours
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }`}
                            />

                            {isEnCours
                              ? "En cours"
                              : "Sorti"}
                          </span>
                        </td>

                        {/* Delete */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() =>
                              handleDelete(
                                sejour.idSejour
                              )
                            }
                            className="rounded-lg p-2 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                            title="Supprimer"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      <AddSejourModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          document.body.classList.remove(
            "modal-open"
          );
        }}
        onAdd={handleAdd}
        loading={modalLoading}
        lits={lits}
        patients={patients}
      />
    </>
  );
}