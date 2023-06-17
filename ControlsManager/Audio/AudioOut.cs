using NAudio.CoreAudioApi;

namespace TeamsDeck.ControlsManager.Audio
{
    public class AudioOut
    {
        private MMDeviceEnumerator DeviceEnumerator { get; set; }
        private MMDevice DefaultDevice { get; set; }

        public AudioOut() 
        { 
            DeviceEnumerator = new MMDeviceEnumerator();
            // Get default out audio device
            DefaultDevice = DeviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
        } 

        /// <summary>
        /// Get all Out Audio Devices
        /// </summary>
        /// <returns>Audio Device</returns>
        public MMDeviceCollection Devices()
        {
            return DeviceEnumerator.EnumerateAudioEndPoints(DataFlow.Render, DeviceState.Active);
        }


        /// <summary>
        /// Mute the master volume
        /// </summary>
        public void Mute()
        {
            // Get volume controler of the default device
            AudioEndpointVolume volume = DefaultDevice.AudioEndpointVolume;

            // Mute the master volume
            if (volume.Mute == false)
            {
                volume.Mute = true;
            }
        }

        /// <summary>
        /// Demute the master volume
        /// </summary>
        public void UnMute()
        {
            // Get volume controler of the default device
            AudioEndpointVolume volume = DefaultDevice.AudioEndpointVolume;

            // Mute the master volume
            if (volume.Mute)
            {
                volume.Mute = false;
            }
        }

        /// <summary>
        /// Switch mute and demute audio
        /// </summary>
        public void MuteSwitcher()
        {
            // Get volume controler of the default device
            AudioEndpointVolume volume = DefaultDevice.AudioEndpointVolume;

            volume.Mute = !volume.Mute;
        }

        /// <summary>
        /// Decrease the master volume by step of 5%
        /// </summary>
        public void MinVolume () 
        {
            // Get volume controler of the default device
            AudioEndpointVolume volume = DefaultDevice.AudioEndpointVolume;

            // Get volume
            float currentVolume = volume.MasterVolumeLevelScalar;

            // Turn down volume by step of 5%
            volume.MasterVolumeLevelScalar = currentVolume - 0.05f;
        }

        /// <summary>
        /// Increase the master volume by step of 5%
        /// </summary>
        public void MaxVolume ()
        {
            // Get default out audio device
            AudioEndpointVolume volume = DefaultDevice.AudioEndpointVolume;

            // Get volume
            float currentVolume = volume.MasterVolumeLevelScalar;

            // Turn down volume by step of 5%
            volume.MasterVolumeLevelScalar = currentVolume + 0.05f;
        }
    }
}
