document.addEventListener('DOMContentLoaded', () => {
  const hostname      = location.hostname;
  const isLocalhost   = hostname === 'localhost';
  const isLoopback    = hostname === '127.0.0.1' || hostname === '::1';
  const isPrivateIPv4 = /^(10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172(?:\.1[6-9]|2[0-9]|3[0-1])(?:\.\d{1,3}){2})$/.test(hostname);
  const isPrivateIPv6 = /^(?:fc00|fd[0-9a-f]{2}|fe80):[0-9a-f:]+$/i.test(hostname);

  if (!document.querySelector('base')) {
    const base = document.createElement('base');
    base.href  = (isLocalhost || isLoopback || isPrivateIPv4 || isPrivateIPv6) ? './' : '/AppKit-on-the-Web/';
    document.head.prepend(base);
  }
});
