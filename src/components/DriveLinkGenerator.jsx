import React, { useState, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useLocation } from '@docusaurus/router';

// ─── URL Configuration ────────────────────────────────────────────────────────
const URL_CONFIG = {
  workers: [
    'https://delivery.temp-drive.workers.dev/',
  ],
  normal: [
    'https://drive.deadtrain.dev/',
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function DriveLinkGenerator() {
  const isBrowser = useIsBrowser();
  const location = useLocation();
  const [outputUrl, setOutputUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isBrowser) return;

    const searchParams = new URLSearchParams(location.search);
    const extractedFilename = searchParams.get('file');

    if (!extractedFilename) {
      window.location.replace('/download-windows-office');
      return;
    }

    setFilename(extractedFilename);

    const checkAndGenerate = async () => {
      let isWorkersReachable = false;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout

      try {
        // Ping the first workers URL to check if the domain is accessible
        await fetch(URL_CONFIG.workers[0], {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });
        isWorkersReachable = true;
      } catch (e) {
        isWorkersReachable = false; // Blocked or timed out
      } finally {
        clearTimeout(timeoutId);
      }

      // Pick from workers if reachable, otherwise fall back to normal domains
      const baseUrl = isWorkersReachable
        ? pickRandom(URL_CONFIG.workers)
        : pickRandom(URL_CONFIG.normal);

      setOutputUrl(`${baseUrl}${extractedFilename}`);
      setIsChecking(false);
    };

    checkAndGenerate();
  }, [isBrowser, location]);

  if (!isBrowser || isChecking) {
    return <div style={{ marginTop: '2rem' }}>Preparing download...</div>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      {outputUrl && (
        <div>
          <a 
            href={outputUrl} 
            className="drive-download-btn"
          >
            Download - {filename}
          </a>
        </div>
      )}
    </div>
  );
}
