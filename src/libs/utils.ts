export const noop = () => {};
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function escapeTextForHTMLContent(s: string) {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}

function findNdx(files: any, endings: string[]) {
  // calling toLowerCase a bunch is bad but there will never be more than a few files
  for (const ending of endings) {
    const ndx = files.findIndex((file: any) => file.name.toLowerCase().endsWith(ending.toLowerCase()));
    if (ndx >= 0) {
      return ndx;
    }
  }
  return -1;
}

export function getOrFindNdx(files: any[], name: string, ...endings: string[]) {
  const ndx = files.findIndex(f => f.name.toLowerCase() === name.toLowerCase);
  if (ndx >= 0) {
    return ndx;
  }
  return findNdx(files, endings);
}

export function getOrFind(files: any[], ...args: string[]) {
  const ndx = getOrFindNdx(files, '', ...args);
  return ndx >= 0 ? files[ndx] : '';
}

const stringify = (options: any, sep: string = ',') => Object.entries(options).map(([key, value]) => `${key}=${value}`).join(sep);

export function createPopup(url: string, config: any = {}): (Window | undefined) {
  const width = config.width || 500;
  const height = config.height || 500;
  const options = {
    width: width,
    height: height,
    top: window.screenY + ((window.outerHeight - height) / 2.5),
    left: window.screenX + ((window.outerWidth - width) / 2)
  };
  return window.open(url, '_blank', stringify(options, ',')) || undefined;
}