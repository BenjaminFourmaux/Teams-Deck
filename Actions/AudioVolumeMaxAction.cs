using BarRaider.SdTools;
using System.ServiceProcess;
using TeamsDeck.ControlsManager.Audio;

namespace TeamsDeck.Actions
{
    [PluginActionId("com.teams-deck.audio.maxvol")]
    public class AudioVolumeMaxAction : KeypadBase
    {
        ServiceController TeamsService = new ServiceController("teams");

        #region KeypadBase Methods

        public AudioVolumeMaxAction(SDConnection connection, InitialPayload payload)
            : base(connection, payload) { }

        public override async void KeyPressed(KeyPayload payload)
        {
            // Check Teams service is running
            //if (TeamsService.Status != ServiceControllerStatus.Running) { await Connection.ShowAlert(); return; }

            Audio.OUT.MaxVolume();
        }

        public override void KeyReleased(KeyPayload payload) { }

        public override void OnTick() { }

        public override void ReceivedGlobalSettings(ReceivedGlobalSettingsPayload payload) { }

        public override void ReceivedSettings(ReceivedSettingsPayload payload) { }

        public override void Dispose() { }

        #endregion
    }
}
