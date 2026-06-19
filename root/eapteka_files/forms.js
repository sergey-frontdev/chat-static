// <script src="https://api.vnedrim-crm.ru/amocrm/infokidmallru/forms.js"></script>
(function () {
  const targetURL = 'https://api.vnedrim-crm.ru/amocrm/infokidmallru/forms_hook/';
  const formSelector = '.form.js-popup-form.js-feedback-form'; // feedback .js-ordershop  js-feedback

  document.addEventListener('submit', function (e) {
    const form = e.target;

    if (!(form instanceof HTMLFormElement) || !form.matches(formSelector)) return;

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (data[key]) {
        if (Array.isArray(data[key])) data[key].push(value);
        else data[key] = [data[key], value];
      } else {
        data[key] = value;
      }
    });

    console.log(' form data: ' , data);  
    
    if (1){
        data._cookies = document.cookie;
        data._page = window.location.href;

        try {
          navigator.sendBeacon(targetURL, new Blob([JSON.stringify(data)], { type: 'application/json' }));
        } catch (err) {
          fetch(targetURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            keepalive: true
          }).catch(console.error);
        }
    }
  }, true);
})();