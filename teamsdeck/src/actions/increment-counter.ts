import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { teamsService, TeamsMeetingState } from "../services/teams-service";

/**
 * Action qui affiche l'état de la réunion Teams et permet de basculer entre les différents états.
 */
@action({ UUID: "com.tech-ben.teamsdeck.increment" })
export class IncrementCounter extends SingletonAction<TeamsSettings> {
	private stateListener: (state: TeamsMeetingState) => void;

	constructor() {
		super();
		
		// Créer le listener pour les changements d'état
		this.stateListener = (state: TeamsMeetingState) => {
			this.updateDisplay(state);
		};
	}

	/**
	 * Initialise la connexion Teams et l'affichage quand l'action devient visible
	 */
	override async onWillAppear(ev: WillAppearEvent<TeamsSettings>): Promise<void> {
		const settings = ev.payload.settings;
		
		// Ajouter le listener pour les changements d'état
		teamsService.addStateListener(this.stateListener);
		
		settings.teamsApiToken =  " ";

		// Connecter à Teams si un token est configuré
		if (settings.teamsApiToken) {
			try {
				await teamsService.connect(settings.teamsApiToken);
				await ev.action.setTitle("Connecté");
			} catch (error) {
				await ev.action.setTitle("Erreur connexion");
			}
		} else {
			await ev.action.setTitle("Token requis");
		}
		
		// Mettre à jour l'affichage avec l'état actuel
		const currentState = teamsService.getMeetingState();
		this.updateDisplayForAction(ev.action, currentState);
	}

	/**
	 * Gère les pressions de touches - rafraîchit l'état ou bascule le mode d'affichage
	 */
	override async onKeyDown(ev: KeyDownEvent<TeamsSettings>): Promise<void> {
		const { settings } = ev.payload;

		settings.teamsApiToken = " ";
		
		// Si pas de token, demander la configuration
		if (!settings.teamsApiToken) {
			await ev.action.setTitle("Configurer token");
			await ev.action.showAlert();
			return;
		}

		// Vérifier la connexion
		if (!teamsService.isConnectedToTeams()) {
			try {
				await teamsService.connect(settings.teamsApiToken);
			} catch (error) {
				await ev.action.setTitle("Erreur connexion");
				await ev.action.showAlert();
				return;
			}
		}

		// Rafraîchir l'état de la réunion
		teamsService.refreshMeetingState();
		
		// Basculer le mode d'affichage
		settings.displayMode = settings.displayMode === 'mute' ? 'camera' : 
		                      settings.displayMode === 'camera' ? 'meeting' : 'mute';
		
		await ev.action.setSettings(settings);
		
		// Mettre à jour l'affichage immédiatement
		const currentState = teamsService.getMeetingState();
		this.updateDisplayForAction(ev.action, currentState);
	}

	/**
	 * Met à jour l'affichage pour toutes les actions
	 */
	private updateDisplay(state: TeamsMeetingState): void {
		// Cette méthode sera appelée pour toutes les instances de l'action
		// Nous devons parcourir toutes les actions actives
		// Pour l'instant, nous utilisons updateDisplayForAction dans les événements spécifiques
	}

	/**
	 * Met à jour l'affichage pour une action spécifique
	 */
	private async updateDisplayForAction(action: any, state: TeamsMeetingState): Promise<void> {
		const settings = await action.getSettings() as TeamsSettings;
		const displayMode = settings.displayMode || 'mute';
		
		let title = "";
		let stateColor = 0; // 0 = normal, 1 = alert
		
		switch (displayMode) {
			case 'mute':
				if (state.isMuted === true) {
					title = "🔇\nMuet";
					stateColor = 1;
				} else if (state.isMuted === false) {
					title = "🔊\nAudio";
					stateColor = 0;
				} else {
					title = "🔊\nAudio\n?";
				}
				break;
				
			case 'camera':
				if (state.isCameraOn === true) {
					title = "📹\nCaméra";
					stateColor = 0;
				} else if (state.isCameraOn === false) {
					title = "📹\nArrêt";
					stateColor = 1;
				} else {
					title = "📹\nCaméra ?";
				}
				break;
				
			case 'meeting':
				if (state.isInMeeting === true) {
					const participants = state.participantCount ? ` (${state.participantCount})` : '';
					title = `📞\nRéunion`;
					stateColor = 0;
				} else if (state.isInMeeting === false) {
					title = "📞\nHors réunion";
					stateColor = 1;
				} else {
					title = "📞\nRéunion ?";
				}
				break;
		}
		
		await action.setTitle(title);
		
		// Changer l'état visuel en fonction du statut
		if (stateColor === 1) {
			await action.setState(1);
		} else {
			await action.setState(0);
		}
	}
}

/**
 * Paramètres pour l'action Teams
 */
type TeamsSettings = {
	teamsApiToken?: string;
	displayMode?: 'mute' | 'camera' | 'meeting';
};
