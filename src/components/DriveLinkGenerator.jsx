import React, { useState, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useLocation } from '@docusaurus/router';
import styles from './DriveLinkGenerator.module.css';

/* ── Icon helpers ─────────────────────────────────────────────────────────── */

function SpinnerIcon() {
  return (
    <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg className={styles.fileIcon} viewBox="0 0 24 24"
      fill="none" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.25"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className={styles.expiryIcon} width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* ── Utilities ────────────────────────────────────────────────────────────── */

function formatBytes(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/* ── Component ────────────────────────────────────────────────────────────── */

export default function DriveLinkGenerator() {
  const isBrowser = useIsBrowser();
  const { search } = useLocation();
  const [outputUrl, setOutputUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [fileDetails, setFileDetails] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState('');
  const [isConnectionError, setIsConnectionError] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;

    const rawQuery = search.startsWith('?') ? search.slice(1) : search;
    const extractedFilename = decodeURIComponent(rawQuery);

    if (!extractedFilename) {
      window.location.replace('/download-windows-office');
      return;
    }

    setFilename(extractedFilename);
    setIsChecking(true);
    setError('');
    setIsConnectionError(false);

    const controller = new AbortController();

    const fetchLink = async () => {
      try {
        const response = await fetch(
          `/api/drive/generate-link?filename=${encodeURIComponent(extractedFilename)}`,
          { signal: controller.signal }
        );

        const data = await response.json().catch(() => null);

        if (response.status === 404 || (data && !data.success && data.error === 'File not found')) {
          setError('The requested file could not be found in our available downloads.');
          return;
        }

        if (!response.ok || !data?.success) {
          setError(data?.error || 'Failed to generate download link.');
          setIsConnectionError(true);
          return;
        }

        setOutputUrl(data.url);
        if (data.filename) setFilename(data.filename);
        setFileDetails({ sha256: data.sha256, bytes: data.bytes });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error generating link:', err);
          setError('Error connecting to link delivery service.');
          setIsConnectionError(true);
        }
      } finally {
        setIsChecking(false);
      }
    };

    fetchLink();

    return () => controller.abort();
  }, [isBrowser, search]);

  /* ── Loading ── */
  if (!isBrowser || isChecking) {
    return (
      <div className={styles.loadingBox}>
        <SpinnerIcon />
        <span>Preparing download link...</span>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className={styles.errorBox}>
        <div className={styles.errorTitle}>
          <AlertIcon />
          <span>{error}</span>
        </div>
        {filename && (
          <div className={styles.errorFile}>
            <code>{filename}</code>
          </div>
        )}
        <p className={styles.errorSubtext}>
          {isConnectionError ? (
            <>
              Please report this issue{' '}
              <a href="https://discord.gg/476fzQ3mV3" target="_blank" rel="noopener noreferrer">
                here
              </a>.
            </>
          ) : (
            <>
              Please verify the link or check our{' '}
              <a href="/download-windows-office">download index</a>.
            </>
          )}
        </p>
      </div>
    );
  }

  /* ── Success ── */
  const formattedSize = fileDetails?.bytes ? formatBytes(fileDetails.bytes) : '';

  return (
    <div className={styles.container}>
      {outputUrl && (
        <div className={styles.card}>
          <div className={styles.fileHeader}>
            <FileIcon />
            <div className={styles.fileNameWrapper}>
              <div className={styles.fileName}>{filename}</div>
            </div>
          </div>

          {(fileDetails?.bytes || fileDetails?.sha256) && (
            <div className={styles.metaBox}>
              {fileDetails.bytes && (
                <div>
                  <strong className={styles.metaLabel}>File Size: </strong>
                  <span>{formattedSize}</span>{' '}
                  <span className={styles.metaBytes}>({fileDetails.bytes.toLocaleString()} bytes)</span>
                </div>
              )}
              {fileDetails.sha256 && (
                <div className={styles.sha256Wrapper}>
                  <strong className={styles.metaLabel}>SHA-256: </strong>
                  <code className={styles.sha256Code}>{fileDetails.sha256}</code>
                </div>
              )}
            </div>
          )}

          <div className={styles.actionArea}>
            <a href={outputUrl} className={`download-button ${styles.downloadButton}`}>
              <DownloadIcon />
              Download {formattedSize ? `(${formattedSize})` : 'File'}
            </a>
            <div className={styles.expiryNotice}>
              <ClockIcon />
              <span>Download links are valid for 6 hours and may be IP-specific.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
