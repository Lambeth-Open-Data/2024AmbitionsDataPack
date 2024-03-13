let currentMenu = 1;

function showMenu(menuNumber) {
  document.getElementById(`menu${currentMenu}`).classList.remove('active');
  document.getElementById(`menu${menuNumber}`).classList.add('active');
  currentMenu = menuNumber;
}

function showNextMenu() {
  const nextMenu = currentMenu === 3 ? 1 : currentMenu + 1;
  showMenu(nextMenu);
}

function showPreviousMenu() {
  const prevMenu = currentMenu === 1 ? 3 : currentMenu - 1;
  showMenu(prevMenu);
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    showPreviousMenu();
  } else if (event.key === 'ArrowRight') {
    showNextMenu();
  }
});
