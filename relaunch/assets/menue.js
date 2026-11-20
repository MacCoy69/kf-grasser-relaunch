// Burger-Menü: öffnet die Hauptnavigation unterhalb von 1040 px.
(function () {
  var kopf = document.querySelector('.kopf');
  if (!kopf) return;
  var knopf = kopf.querySelector('.menue-knopf');
  var nav = kopf.querySelector('.hauptnav');
  if (!knopf || !nav) return;
  function setze(offen) {
    kopf.classList.toggle('offen', offen);
    knopf.setAttribute('aria-expanded', offen ? 'true' : 'false');
    knopf.setAttribute('aria-label', offen ? 'Menü schließen' : 'Menü öffnen');
  }
  knopf.addEventListener('click', function () {
    setze(knopf.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setze(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && kopf.classList.contains('offen')) { setze(false); knopf.focus(); }
  });
  window.matchMedia('(min-width: 1041px)').addEventListener('change', function (m) {
    if (m.matches) setze(false);
  });
})();
