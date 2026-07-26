import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM && window.location.pathname.startsWith('/drive/')) {
  // Silently rewrite /drive/filename.iso → /drive?file=filename.iso for React Router
  const file = window.location.pathname.substring('/drive/'.length);
  window.history.replaceState(null, '', '/drive?file=' + encodeURIComponent(file));
}
