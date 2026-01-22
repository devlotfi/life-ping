import type { AppTranslation } from "../types/app-translation";

export const FR: AppTranslation = {
  dashboard: "Tableau de bord",
  settings: "Paramètres",
  information: "Informations",

  save: "Enregistrer",
  apiKey: "Clé API",
  apiKeyDescription:
    "La clé API est utilisée pour autoriser l'accès à votre worker Cloudflare",
  apiKeySaved: "La clé API a été enregistrée",
  baseUrl: "URL de base",
  baseUrlDescription: "L'URL de base de votre worker Cloudflare",
  baseUrlSaved: "L'URL de base a été enregistrée",
  name: "Nom",
  nameDescription: "Le nom qui sera affiché aux destinataires dans l'e-mail",
  nameSaved: "Nom enregistré",
  emails: "E-mails",
  emailsDescription:
    "Les adresses e-mail qui recevront l'alerte en cas d'inactivité",
  emailsSaved: "E-mails enregistrés",
  language: "Langue",
  email: "E-mail",
  emptyList: "La liste est vide",
  unsavedChanges: "Modifications non enregistrées",
  nextAlert: "Prochaine alerte",
  alertCountdown: "Compte à rebours de l'alerte",
  timerElapsed: "Minuteur expiré",
  cancel: "Annuler",
  timerUpdated: "Minuteur mis à jour",

  connectionError: "Erreur de connexion",
  permissionRequired: "Autorisation requise",
  unknownError: "Erreur inconnue",
  requestError: "Erreur de requête",
};
