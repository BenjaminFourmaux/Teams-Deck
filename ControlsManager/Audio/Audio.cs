namespace TeamsDeck.ControlsManager.Audio
{
    public class Audio
    {
        /// <summary>
        /// Audio In 
        /// </summary>
        public static AudioIn IN { get; private set; } = new AudioIn();

        /// <summary>
        /// Audio Out
        /// </summary>
        public static AudioOut OUT { get; private set; } = new AudioOut();
    }
}
