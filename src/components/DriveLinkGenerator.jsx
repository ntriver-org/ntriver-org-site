import React, { useState, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useLocation } from '@docusaurus/router';

export default function DriveLinkGenerator() {
  const isBrowser = useIsBrowser();
  const { search } = useLocation();
  const [outputUrl, setOutputUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isBrowser) return;

    const rawQuery = search.startsWith('?') ? search.slice(1) : search;
    const extractedFilename = decodeURIComponent(rawQuery);

    if (!extractedFilename) {
      window.location.replace('/download-windows-office');
      return;
    }

    setFilename(extractedFilename);

    const controller = new AbortController();

    const fetchLink = async () => {
      try {
        const response = await fetch(
          `https://delivery-api.ntriver.org/generate-link?filename=${encodeURIComponent(extractedFilename)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data && data.success && data.url) {
          setOutputUrl(data.url);
        } else {
          setError('Failed to generate download link.');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error generating link:', err);
          setError('Error connecting to link delivery service.');
        }
      } finally {
        setIsChecking(false);
      }
    };

    fetchLink();

    return () => controller.abort();
  }, [isBrowser]);

  if (!isBrowser || isChecking) {
    return <div style={{ marginTop: '2rem' }}>Preparing download...</div>;
  }

  if (error) {
    return <div style={{ marginTop: '2rem', color: 'red' }}>{error}</div>;
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
