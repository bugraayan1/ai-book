import { Howl } from 'howler';

const sounds = {
  click: new Howl({
    src: ['/sounds/click.mp3'],
    volume: 0.5
  }),
  background: new Howl({
    src: ['/sounds/background.mp3'],
    volume: 0.3,
    loop: true
  }),
  sun: new Howl({
    src: ['/sounds/sun.mp3'],
    volume: 0.4
  }),
  star: new Howl({
    src: ['/sounds/star.mp3'],
    volume: 0.4
  }),
  sparkles: new Howl({
    src: ['/sounds/sparkles.mp3'],
    volume: 0.4
  }),
  cloud: new Howl({
    src: ['/sounds/cloud.mp3'],
    volume: 0.4
  }),
  bird: new Howl({
    src: ['/sounds/bird.mp3'],
    volume: 0.4
  }),
  fish: new Howl({
    src: ['/sounds/fish.mp3'],
    volume: 0.4
  }),
  rocket: new Howl({
    src: ['/sounds/rocket.mp3'],
    volume: 0.4
  }),
  bike: new Howl({
    src: ['/sounds/bike.mp3'],
    volume: 0.4
  })
};

export const playSound = (name: keyof typeof sounds) => {
  sounds[name].play();
};

export const stopSound = (name: keyof typeof sounds) => {
  sounds[name].stop();
};

export const stopAllSounds = () => {
  Object.values(sounds).forEach(sound => sound.stop());
};

export default sounds; 