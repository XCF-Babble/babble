window.addEventListener('DOMContentLoaded', (event: Event) => {
  const plaintext: Element | null = document.getElementById('plaintext');

  if (plaintext) {
    plaintext.addEventListener('input', (event: Event) => {
      const plaintextInput = plaintext as HTMLInputElement;
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const activeTab: chrome.tabs.Tab = tabs[0];
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(
            activeTab.id,
            { request: 'tunnelCipherText', data: plaintextInput.value },
            (response: any): void => {}
          );
        }
      });
    });
  }
});
