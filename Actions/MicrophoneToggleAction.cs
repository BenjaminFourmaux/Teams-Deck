using BarRaider.SdTools;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.ServiceProcess;
using System.Threading.Tasks;
using TeamsDeck.ControlsManager.Audio;

namespace TeamsDeck.Actions
{
    [PluginActionId("com.teams-deck.microphone.toggle")]
    public class MicrophoneToggleAction : KeypadBase
    {
        #region KeypadBase Methods

        public MicrophoneToggleAction(SDConnection connection, InitialPayload payload) 
            : base(connection, payload) { }

        public override void ReceivedSettings(ReceivedSettingsPayload payload) { }

        public override void ReceivedGlobalSettings(ReceivedGlobalSettingsPayload payload) { }

        public override async void KeyPressed(KeyPayload payload)
        {
            // Mute or Unmute microphone with call Teams
            if (payload.State == 0) // Current state 0 => 1
            { 
                // Mute
                Audio.IN.Mute();
            } 
            else // Current state 1 => 0
            {
                // Unmute
                Audio.IN.UnMute();
            }
        }

        public override async void KeyReleased(KeyPayload payload) { }

        public override async void OnTick() { }

        public override void Dispose() { }

        #endregion
    }
}