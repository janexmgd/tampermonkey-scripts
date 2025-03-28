// ==UserScript==
// @name         Tiktok post grab links
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Script for grabbing TikTok video links with unlimited scrolling
// @author       https://github.com/janexmgd
// @match        *tiktok.com/@*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function grabLinks() {
    console.log('Starting to scroll to the bottom...');

    const scrollToBottom = () => {
      return new Promise((resolve) => {
        let lastHeight = 0;

        const interval = setInterval(() => {
          const currentHeight = document.body.offsetHeight;
          window.scrollBy(0, 1000);
          console.log('Scrolling... Current height:', currentHeight);
          if (currentHeight === lastHeight) {
            clearInterval(interval);
            resolve();
          }

          lastHeight = currentHeight;
        }, 1000);
      });
    };

    const extractLinks = async () => {
      await scrollToBottom();
      console.log(
        'Finished scrolling. Starting to extract tiktok post links...'
      );

      let arrayVideos = [];
      const containers = document.querySelectorAll(
        '[class*="-DivItemContainerV2"]'
      );
      console.log('Containers found:', containers.length); // Debugging

      for (const container of containers) {
        const link = container.querySelector('[data-e2e="user-post-item"] a');
        if (link && link.href) {
          arrayVideos.push(link.href);
        }
      }

      console.log('Tiktok post links extracted:\n', arrayVideos);

      if (arrayVideos.length > 0) {
        console.log('Total post links found:', arrayVideos.length);
        const blob = new Blob([arrayVideos.join('\n')], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const filename = `${window.location.pathname.replace('/', '')}.txt`;
        a.download = `${filename}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log(`File downloaded as ${filename}`);
      } else {
        console.log(`No tiktok post links found.`);
      }
    };

    extractLinks();
  }
  const button = document.createElement('button');
  button.textContent = 'Grab Tiktok Post Links';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = 1000;
  button.style.padding = '10px';
  button.style.backgroundColor = '#007bff';
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', grabLinks);

  document.body.appendChild(button);
  console.log('Button added to the page');
})();
