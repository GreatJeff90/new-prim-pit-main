import { useState, useEffect, useCallback } from 'react';

export const useHeadphoneDetection = () => {
  const [headphoneConnected, setHeadphoneConnected] = useState<boolean | null>(
    null,
  );
  const [isChecking, setIsChecking] = useState(true);

  const checkDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Filter out all audio input and output devices
      const audioDevices = devices.filter(
        (d) => d.kind === 'audiooutput' || d.kind === 'audioinput'
      );

      // Check if we have labels populated (requires media permission)
      const hasLabels = audioDevices.some((d) => d.label !== '');

      let hasHeadphone = false;

      if (hasLabels) {
        // Detailed keyword list covering earpieces, earphones, earpods, airpods, buds, headsets, bluetooth
        const headphoneKeywords = [
          'head',      // headphones, headset
          'ear',       // earphone, earpod, earbud, earpiece, ears
          'pod',       // earpod, airpod, airpods
          'bud',       // earbud, buds, galaxy buds, pixel buds
          'phone',     // headphone, earphone, handsfree
          'bluetooth', // bluetooth connection
          'wireless',  // wireless headsets
          'handsfree', // handsfree device
          'hands-free',
          'hfp',       // Hands-Free Profile
          'a2dp',      // Advanced Audio Distribution Profile
          'external',  // external headphones port
          'jack',      // 3.5mm jack
          'line-out',  // line output
          'hearing',   // hearing aid
          'bt'         // BT headset
        ];

        hasHeadphone = audioDevices.some((d) => {
          const label = d.label.toLowerCase();

          // Exclude built-in speakers or internal microphones to prevent false positives
          const isBuiltIn =
            (label.includes('speaker') && 
             !label.includes('head') && 
             !label.includes('bluetooth') && 
             !label.includes('wireless') && 
             !label.includes('ear') && 
             !label.includes('pod') && 
             !label.includes('bud')) ||
            label.includes('internal') ||
            label.includes('built-in') ||
            (label.includes('microphone') && 
             !label.includes('headset') && 
             !label.includes('bluetooth') && 
             !label.includes('ear') && 
             !label.includes('wireless'));

          if (isBuiltIn) return false;

          // Check if the label contains any of our earpiece/headphone/bluetooth keywords
          const matchesKeyword = headphoneKeywords.some((keyword) =>
            label.includes(keyword)
          );

          // Check if it is a non-default, non-communications external audio output device
          const isExternalOutput =
            d.kind === 'audiooutput' &&
            d.deviceId !== 'default' &&
            d.deviceId !== 'communications' &&
            d.deviceId !== '';

          return matchesKeyword || isExternalOutput;
        });
      } else {
        // Fallback when permission is not yet granted (labels are empty)
        // Check if there are external audio output devices (other than default and communications)
        const audioOutputs = devices.filter((d) => d.kind === 'audiooutput');
        const externalDevices = audioOutputs.filter(
          (d) =>
            d.deviceId !== 'default' &&
            d.deviceId !== 'communications' &&
            d.deviceId !== '',
        );

        hasHeadphone = externalDevices.length > 0;
      }

      setHeadphoneConnected(hasHeadphone);
    } catch (error) {
      console.error('Error detecting devices:', error);
      // Fallback to true so users are not blocked from using the application
      setHeadphoneConnected(true);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkDevices();

    // Listen for connection / disconnection changes
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener?.('devicechange', checkDevices);
    }

    return () => {
      if (navigator.mediaDevices) {
        navigator.mediaDevices.removeEventListener?.('devicechange', checkDevices);
      }
    };
  }, [checkDevices]);

  return { headphoneConnected, isChecking };
};
