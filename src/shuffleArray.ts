// copied from here: https://gist.github.com/nikolas/96586a0b56f53eabfd6fe4ed59fecb98
const shuffleArray = (array: Array<any>) => {
  const a = array.slice();

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

export default shuffleArray;
