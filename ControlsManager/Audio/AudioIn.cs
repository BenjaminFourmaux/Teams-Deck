using NAudio.CoreAudioApi;
using System;
using System.Collections.Generic;

namespace TeamsDeck.ControlsManager.Audio
{
    public class AudioIn
    {


        /// <summary>
        /// Get list of all active Audio IN Devices
        /// </summary>
        /// <returns>List of string of Device</returns>
        public List<string> ListDevice() 
        {
            List<string> list = new List<string>();
            // Créer une instance de MMDeviceEnumerator
            MMDeviceEnumerator enumerator = new MMDeviceEnumerator();

            // Récupérer tous les périphériques audio d'entrée
            MMDeviceCollection devices = enumerator.EnumerateAudioEndPoints(DataFlow.Capture, DeviceState.Active);

            // Parcourir les périphériques et afficher leurs noms
            foreach (MMDevice device in devices)
            {
                list.Add(device.FriendlyName);
            }

            return list;
        }
    }
}
