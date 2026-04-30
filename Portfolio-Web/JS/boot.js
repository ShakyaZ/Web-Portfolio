/**
 * Simplified Boot loader script for portfolio
 */

const ENABLED = true;

if (ENABLED) {
  document.addEventListener('DOMContentLoaded', () => {
    const boot = document.getElementById('boot');
    if (!boot) return;

    // Fixed cinematic delay before entering the site
    setTimeout(() => {
      skipBoot();
    }, 1800); 

    function skipBoot() {
      boot.classList.add('out');
      
      // Dispatch event to notify script.js to start shield transition
      window.dispatchEvent(new Event('bootComplete'));

      setTimeout(() => {
        boot.style.display = 'none';
      }, 1500);
    }
  });
}