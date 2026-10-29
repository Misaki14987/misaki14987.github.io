import 'aplayer/dist/APlayer.min.css';
import '../../../styles/components/music-player.scss';
// APlayer does not publish TypeScript declarations.
// @ts-expect-error untyped upstream package
import APlayer from 'aplayer';

export const initializeMusicPlayers = (article: HTMLElement, signal: AbortSignal) => {
  const players: { destroy: () => void }[] = [];
  for (const figure of article.querySelectorAll<HTMLElement>('[data-music-player]')) {
    const container = figure.querySelector<HTMLElement>('[data-aplayer]');
    if (!container) continue;
    const player = new APlayer({
      container,
      autoplay: false,
      preload: 'none',
      theme: '#8b3c30',
      loop: 'none',
      volume: 0.6,
      mutex: true,
      audio: {
        name: figure.dataset.name,
        artist: figure.dataset.artist,
        url: `https://music.163.com/song/media/outer/url?id=${figure.dataset.musicPlayer}.mp3`,
        cover: figure.dataset.cover,
      },
    });
    const playButton = container.querySelector<HTMLElement>('.aplayer-pic');
    if (playButton) {
      playButton.setAttribute('role', 'button');
      playButton.tabIndex = 0;
      const label = () => playButton.setAttribute('aria-label', `${player.audio.paused ? '播放' : '暂停'} ${figure.dataset.name}`);
      label();
      player.on('play', label);
      player.on('pause', label);
      playButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          player.toggle();
        }
      }, { signal });
    }
    container.querySelector('.aplayer-icon-volume-down')?.setAttribute('aria-label', '切换静音');
    container.querySelector('.aplayer-icon-loop')?.setAttribute('aria-label', '切换循环播放');
    player.on('error', () => {
      player.pause();
      player.notice('音源暂不可用，可从下方前往网易云音乐收听。', 0);
    });
    players.push(player);
  }
  const destroy = () => players.forEach((player) => player.destroy());
  if (signal.aborted) destroy();
  else signal.addEventListener('abort', destroy, { once: true });
};
