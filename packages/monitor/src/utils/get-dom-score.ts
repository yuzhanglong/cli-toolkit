export interface GetDomSizeScoreOptions {
  element: HTMLElement | null;
  depth: number;
  ignoreTags: string[];
}

export const getDomScore = (options: GetDomSizeScoreOptions) => {
  const { element, depth, ignoreTags = [] } = options;

  if (!element || ignoreTags.includes(element.tagName)) {
    return 0;
  }

  const children = Array.from(element.children || []);

  const childScoreTotal = 0;

  for (let i = 0; i < children.length; i += 1) {
    const childScore = getDomScore(element[i]);

  }

};
