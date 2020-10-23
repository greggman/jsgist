export const noop = () => {};
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function find(files, endings) {
  // calling toLowerCase a bunch is bad but there will never be more than a few files
  for (const ending of endings) {
    const file = files.find(file => file.name.toLowerCase().endsWith(ending.toLowerCase()));
    if (file) {
      return file;
    }
  }
  return '';
}

export function getOrFind(files, name, ...endings) {
  return files.find(f => f.name.toLowerCase() === name.toLowerCase) || find(files, endings);
}

const stringify = options => Object.entries(options).map(([key, value]) => `${key}=${value}`).join(',');

export function createPopup(url, config = {}) {
  const width = config.width || 500;
  const height = config.height || 500;
  const options = {
    width: width,
    height: height,
    top: window.screenY + ((window.outerHeight - height) / 2.5),
    left: window.screenX + ((window.outerWidth - width) / 2)
  };
  return window.open(url, '_blank', stringify(options, ','));
}