using BarRaider.SdTools;
using System.ServiceProcess;
using TeamsDeck.ControlsManager.Audio;

namespace TeamsDeck.Actions
{
    [PluginActionId("com.teams-deck.microphone.toggle")]
    public class MicrophoneToggleAction : KeypadBase
    {
        ServiceController TeamsService = new ServiceController("teams");

        #region KeypadBase Methods

        public MicrophoneToggleAction(SDConnection connection, InitialPayload payload) 
            : base(connection, payload) { }

        public override void ReceivedSettings(ReceivedSettingsPayload payload) { }

        public override void ReceivedGlobalSettings(ReceivedGlobalSettingsPayload payload) { }

        public override async void KeyPressed(KeyPayload payload)
        {
            // Check Teams service is running
            if (TeamsService.Status != ServiceControllerStatus.Running) { await Connection.ShowAlert(); return; }

            // Mute or Unmute microphone with call Teams
            if (payload.State == 0) // Current state 0 => 1
            { 
                // TODO : Call Teams to mute microphone
            } 
            else // Current state 1 => 0
            {
                // TODO : Call Teams to unmute microphone
            }
            
        }

        public override async void KeyReleased(KeyPayload payload) { }

        public override async void OnTick() { }

        public override void Dispose() { }

        #endregion
    }
}