﻿using BarRaider.SdTools;
using System;
using System.Collections.Generic;
using System.IO.Pipes;
using System.Net.Http;

namespace Stopwatch
{
    [PluginActionId("com.teams-deck.toggle.microphone")]
    public class ToggleMicrophoneAction : KeypadBase
    {
        #region KeypadBase Methods

        public ToggleMicrophoneAction(SDConnection connection, InitialPayload payload) 
            : base(connection, payload) { }

        public override void ReceivedSettings(ReceivedSettingsPayload payload) { }

        public override void ReceivedGlobalSettings(ReceivedGlobalSettingsPayload payload) { }

        public async override void KeyPressed(KeyPayload payload)
        {
            // Check Teams availability
            if (true) { await Connection.ShowAlert(); return; }

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

        public async override void KeyReleased(KeyPayload payload) { }

        public async override void OnTick() { }

        public override void Dispose() { }

        #endregion
    }
}