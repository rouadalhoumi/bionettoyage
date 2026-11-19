import axios, { AxiosInstance } from "axios";

// Types
export interface Service {
  idEtage: number;
  numeroEtage: string;
}

export interface Chambre {
  idChambre: number;
  numeroChambre: string;
  idEtage: number;
}

export interface Etat {
  idEtat: number;
  libelle: string;
  disponibilite: boolean;
}

export interface Lit {
  idLit: number;
  numeroLit: string;
  idChambre: number;
  idEtat: number;
  nomPatient?: string; // null if not OCCUPEE
  nomAgent?: string;   // null if not EN_NETTOYAGE
}

export interface Patient {
  idPatient: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
}

export interface Sejour {
  idSejour: number;
  numFiche: number;
  dateAdmission: string;
  dateSortie?: string;
  idPatient: number;
  idLit: number;
}

export interface Personnel {
  idAgent: number;
  nom: string;
  prenom: string;
  qualification: string;
}

export interface Protocole {
  idProtocole: number;
  nomProtocole: string;
  description: string;
  frequence: string;
  produits?: Produit[]; // produits liés à ce protocole
}

export interface Produit {
  idProduit: number;
  nomProduit: string;
  typeProduit: string;
  disponible: boolean;
}

export interface HistoriqueLit {
  idHistorique: number;
  dateOperation: string;
  typeOperation: string;
  observation: string;
  idLit: number;
  idAgent: number;
  idProtocole: number;
}

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============ SERVICES (Étages) ============
export const servicesAPI = {
  getAll: () => apiClient.get<Service[]>("/etages"),
  getById: (id: number) => apiClient.get<Service>(`/etages/${id}`),
  create: (data: Omit<Service, "idEtage">) => apiClient.post<Service>("/etages", data),
  update: (id: number, data: Omit<Service, "idEtage">) =>
    apiClient.put<Service>(`/etages/${id}`, data),
  delete: (id: number) => apiClient.delete(`/etages/${id}`),
};

// ============ CHAMBRES ============
export const chambresAPI = {
  getAll: () => apiClient.get<Chambre[]>("/chambres"),
  getById: (id: number) => apiClient.get<Chambre>(`/chambres/${id}`),
  create: (data: Omit<Chambre, "idChambre">) =>
    apiClient.post<Chambre>("/chambres", data),
  update: (id: number, data: Omit<Chambre, "idChambre">) =>
    apiClient.put<Chambre>(`/chambres/${id}`, data),
  delete: (id: number) => apiClient.delete(`/chambres/${id}`),
  getByService: (idEtage: number) =>
    apiClient.get<Chambre[]>(`/etages/${idEtage}/chambres`),
};

// ============ LITS ============
export const litsAPI = {
  getAll: () => apiClient.get<Lit[]>("/lits"),
  getById: (id: number) => apiClient.get<Lit>(`/lits/${id}`),
  create: (data: Omit<Lit, "idLit">) => apiClient.post<Lit>("/lits", data),
  update: (id: number, data: Omit<Lit, "idLit">) =>
    apiClient.put<Lit>(`/lits/${id}`, data),
  delete: (id: number) => apiClient.delete(`/lits/${id}`),
  getByChambre: (idChambre: number) =>
    apiClient.get<Lit[]>(`/chambres/${idChambre}/lits`),
  changeState: (idLit: number, idEtat: number) =>
    apiClient.put<Lit>(`/lits/${idLit}/etat/${idEtat}`),
};

// ============ ÉTATS ============
export const etatsAPI = {
  getAll: () => apiClient.get<Etat[]>("/etats"),
  getById: (id: number) => apiClient.get<Etat>(`/etats/${id}`),
  create: (data: Omit<Etat, "idEtat">) => apiClient.post<Etat>("/etats", data),
  update: (id: number, data: Omit<Etat, "idEtat">) =>
    apiClient.put<Etat>(`/etats/${id}`, data),
  delete: (id: number) => apiClient.delete(`/etats/${id}`),
};

// ============ PATIENTS ============
export const patientsAPI = {
  getAll: () => apiClient.get<Patient[]>("/patients"),
  getById: (id: number) => apiClient.get<Patient>(`/patients/${id}`),
  create: (data: Omit<Patient, "idPatient">) =>
    apiClient.post<Patient>("/patients", data),
  update: (id: number, data: Omit<Patient, "idPatient">) =>
    apiClient.put<Patient>(`/patients/${id}`, data),
  delete: (id: number) => apiClient.delete(`/patients/${id}`),
};

// ============ SÉJOURS ============
export const sejoursAPI = {
  getAll: () => apiClient.get<Sejour[]>("/sejours"),
  getById: (id: number) => apiClient.get<Sejour>(`/sejours/${id}`),
  create: (data: Omit<Sejour, "idSejour">) =>
    apiClient.post<Sejour>("/sejours", data),
  update: (id: number, data: Omit<Sejour, "idSejour">) =>
    apiClient.put<Sejour>(`/sejours/${id}`, data),
  delete: (id: number) => apiClient.delete(`/sejours/${id}`),
  getByPatient: (idPatient: number) =>
    apiClient.get<Sejour[]>(`/patients/${idPatient}/sejours`),
};

// ============ PERSONNEL ============
export const personnelAPI = {
  getAll: () => apiClient.get<Personnel[]>("/personnels"),
  getById: (id: number) => apiClient.get<Personnel>(`/personnels/${id}`),
  create: (data: Omit<Personnel, "idAgent">) =>
    apiClient.post<Personnel>("/personnels", data),
  update: (id: number, data: Omit<Personnel, "idAgent">) =>
    apiClient.put<Personnel>(`/personnels/${id}`, data),
  delete: (id: number) => apiClient.delete(`/personnels/${id}`),
};

// ============ PROTOCOLES ============
export const protocolesAPI = {
  getAll: () => apiClient.get<Protocole[]>("/protocoles"),
  getById: (id: number) => apiClient.get<Protocole>(`/protocoles/${id}`),
  create: (data: Omit<Protocole, "idProtocole">) =>
    apiClient.post<Protocole>("/protocoles", data),
  update: (id: number, data: Omit<Protocole, "idProtocole">) =>
    apiClient.put<Protocole>(`/protocoles/${id}`, data),
  delete: (id: number) => apiClient.delete(`/protocoles/${id}`),
};

// ============ PRODUITS ============
export const produitsAPI = {
  getAll: () => apiClient.get<Produit[]>("/produits"),
  getById: (id: number) => apiClient.get<Produit>(`/produits/${id}`),
  create: (data: Omit<Produit, "idProduit">) =>
    apiClient.post<Produit>("/produits", data),
  update: (id: number, data: Omit<Produit, "idProduit">) =>
    apiClient.put<Produit>(`/produits/${id}`, data),
  delete: (id: number) => apiClient.delete(`/produits/${id}`),
};

// ============ HISTORIQUE ============
export const historiqueAPI = {
  getAll: () => apiClient.get<HistoriqueLit[]>("/historiques"),
  getById: (id: number) => apiClient.get<HistoriqueLit>(`/historiques/${id}`),
  create: (data: Omit<HistoriqueLit, "idHistorique">) =>
    apiClient.post<HistoriqueLit>("/historiques/enregistrer", data),
  delete: (id: number) => apiClient.delete(`/historiques/${id}`),
  getByLit: (idLit: number) =>
    apiClient.get<HistoriqueLit[]>(`/historiques/lit/${idLit}`),
};

export default apiClient;