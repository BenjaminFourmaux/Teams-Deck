import { LogLevel, streamDeck } from "@elgato/streamdeck";
import WebSocket from "ws";

/**
 * Interface pour l'état d'une réunion Teams
 */
export interface TeamsMeetingState {
    isMuted?: boolean;
    isCameraOn?: boolean;
    isInMeeting?: boolean;
    isRecording?: boolean;
    isHandRaised?: boolean;
    meetingId?: string;
    participantCount?: number;
}

/**
 * Interface pour les messages Teams API
 */
interface TeamsApiMessage {
    apiVersion: string;
    service: string;
    action: string;
    manufacturer: string;
    device: string;
    timestamp: number;
    data?: any;
}

/**
 * Service pour gérer la connexion WebSocket vers Microsoft Teams
 */
export class TeamsService {
    private ws: WebSocket | null = null;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private meetingState: TeamsMeetingState = {};
    private listeners: ((state: TeamsMeetingState) => void)[] = [];

    /**
     * Connecte au WebSocket Teams
     * @param apiToken Token API obtenu depuis les paramètres de confidentialité Teams
     */
    async connect(apiToken: string): Promise<void> {
        if (this.isConnected) {
            return;
        }

        const wsUrl = `ws://localhost:8124?protocol-version=1.0.0&manufacturer=Elgato&device=StreamDeck&app=TeamsDeck&app-version=1.0`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                streamDeck.logger.info("Connexion WebSocket Teams établie");
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.queryMeetingState();
            };

            this.ws.onmessage = (event) => {
                const data = typeof event.data === 'string' ? event.data : event.data.toString();
                this.handleMessage(data);
            };

            this.ws.onclose = () => {
                streamDeck.logger.info("Connexion WebSocket Teams fermée");
                this.isConnected = false;
                this.attemptReconnect(apiToken);
            };

            this.ws.onerror = (error) => {
                streamDeck.logger.error("Erreur WebSocket Teams:", error);
                this.isConnected = false;
            };

        } catch (error) {
            streamDeck.logger.error("Erreur lors de la connexion WebSocket Teams:", error);
            throw error;
        }
    }

    /**
     * Déconnecte du WebSocket Teams
     */
    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
    }

    /**
     * Interroge l'état de la réunion Teams
     */
    private queryMeetingState(): void {
        if (!this.isConnected || !this.ws) {
            return;
        }

        const message: TeamsApiMessage = {
            apiVersion: "1.0.0",
            service: "query-meeting-state",
            action: "query-meeting-state",
            manufacturer: "Elgato",
            device: "StreamDeck",
            timestamp: Date.now()
        };

        this.ws.send(JSON.stringify(message));
    }

    /**
     * Gère les messages reçus du WebSocket
     */
    private handleMessage(data: string): void {
        try {
            const message = JSON.parse(data);
            streamDeck.logger.debug("Message reçu de Teams:", message);

            // Traiter les différents types de messages
            if (message.service === "query-meeting-state" && message.data) {
                this.updateMeetingState(message.data);
            }

        } catch (error) {
            streamDeck.logger.error("Erreur lors du traitement du message Teams:", error);
        }
    }

    /**
     * Met à jour l'état de la réunion
     */
    private updateMeetingState(data: any): void {
        const newState: TeamsMeetingState = {
            isMuted: data.isMuted,
            isCameraOn: data.isCameraOn,
            isInMeeting: data.isInMeeting,
            isRecording: data.isRecording,
            isHandRaised: data.isHandRaised,
            meetingId: data.meetingId,
            participantCount: data.participantCount
        };

        this.meetingState = { ...this.meetingState, ...newState };
        this.notifyListeners();
    }

    /**
     * Notifie les listeners des changements d'état
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.meetingState);
            } catch (error) {
                streamDeck.logger.error("Erreur lors de la notification du listener:", error);
            }
        });
    }

    /**
     * Tente de se reconnecter automatiquement
     */
    private async attemptReconnect(apiToken: string): Promise<void> {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            streamDeck.logger.error("Nombre maximum de tentatives de reconnexion atteint");
            return;
        }

        this.reconnectAttempts++;
        streamDeck.logger.info(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

        setTimeout(() => {
            this.connect(apiToken);
        }, this.reconnectDelay * this.reconnectAttempts);
    }

    /**
     * Ajoute un listener pour les changements d'état
     */
    addStateListener(listener: (state: TeamsMeetingState) => void): void {
        this.listeners.push(listener);
    }

    /**
     * Supprime un listener
     */
    removeStateListener(listener: (state: TeamsMeetingState) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Récupère l'état actuel de la réunion
     */
    getMeetingState(): TeamsMeetingState {
        return { ...this.meetingState };
    }

    /**
     * Vérifie si la connexion est active
     */
    isConnectedToTeams(): boolean {
        return this.isConnected;
    }

    /**
     * Rafraîchit l'état de la réunion
     */
    refreshMeetingState(): void {
        this.queryMeetingState();
    }
}

// Instance singleton du service Teams
export const teamsService = new TeamsService();
