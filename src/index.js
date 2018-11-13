import './styles/index.scss';
import Game from './Classes/Game';

const newGameBtn = document.getElementById('start-new-game');

newGameBtn.addEventListener('click', () => {
  const game = new Game();
  game.startNewGame();
  document.getElementById('main-container').classList.remove('hidden');
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('ServiceWorker.js')
    .then(() => navigator.serviceWorker.ready)
    .then(registration => {
      // eslint-disable-next-line no-console
      console.log('Registration success', registration);
    })
    .catch(error => {
      console.error('Registration error', error);
    });
}

