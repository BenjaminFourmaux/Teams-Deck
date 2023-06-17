using NAudio.CoreAudioApi;

namespace TeamsDeck.ControlsManager.Audio
{
    public class AudioIn
    {
        public static string TargetService { get; private set; } = "Teams";
        private MMDeviceEnumerator DeviceEnumerator { get; set; }
       

        public AudioIn()
        {
            DeviceEnumerator = new MMDeviceEnumerator();
        }


        public void Mute()
        {
            var device = FindCurrentDevice();

            if (device != null)
            {
                device.AudioEndpointVolume.Mute = true;
            }
        }

        public void UnMute()
        {
            var device = FindCurrentDevice();

            if (device != null)
            {
                device.AudioEndpointVolume.Mute = false;
            }
        }

        /// <summary>
        /// Mute/Unmute the device
        /// </summary>
        public void MuteSwitcher()
        {
            var device = FindCurrentDevice();

            if (device != null)
            {
                device.AudioEndpointVolume.Mute = !device.AudioEndpointVolume.Mute; 
            }
        }

        /// <summary>
        /// Get the current audio device used by the <paramref name="TargetService"/>
        /// </summary>
        /// <returns>The current used <typeparamref name="MMDevice"/></returns>
        public MMDevice FindCurrentDevice()
        {
            // Get all devices
            var allDevices = DeviceEnumerator.EnumerateAudioEndPoints(DataFlow.Capture, DeviceState.Active);

            if (allDevices != null)
            {
                foreach (var device in allDevices)
                {
                    // Get active session
                     var sessionManager = device.AudioSessionManager;

                    var activeSession = sessionManager.Sessions;

                    // Browse active session and find if one is used by the TargetService
                    for (var i = 0; i < activeSession.Count; i++) 
                    {
                        if (activeSession[i].GetSessionIdentifier.Contains(TargetService))
                        {
                            return device;
                        }
                    }
                }
            }
            return null;
        }
    }
}
