export interface DiffToken {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

export function computeWordDiff(oldText: string, newText: string): DiffToken[] {
  const oldWords = oldText.split(/(\s+|[.,!?;:()[\]"'])/).filter(Boolean);
  const newWords = newText.split(/(\s+|[.,!?;:()[\]"'])/).filter(Boolean);

  const diff: DiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < oldWords.length || j < newWords.length) {
    if (i < oldWords.length && j < newWords.length && oldWords[i] === newWords[j]) {
      diff.push({ type: 'unchanged', value: oldWords[i] });
      i++;
      j++;
    } else {
      // Lookahead match
      let matchInNew = -1;
      for (let look = j + 1; look < Math.min(j + 8, newWords.length); look++) {
        if (newWords[look] === oldWords[i]) {
          matchInNew = look;
          break;
        }
      }

      let matchInOld = -1;
      for (let look = i + 1; look < Math.min(i + 8, oldWords.length); look++) {
        if (oldWords[look] === newWords[j]) {
          matchInOld = look;
          break;
        }
      }

      if (matchInNew !== -1 && (matchInOld === -1 || (matchInNew - j) <= (matchInOld - i))) {
        // Words were added
        while (j < matchInNew) {
          diff.push({ type: 'added', value: newWords[j] });
          j++;
        }
      } else if (matchInOld !== -1) {
        // Words were removed
        while (i < matchInOld) {
          diff.push({ type: 'removed', value: oldWords[i] });
          i++;
        }
      } else {
        if (i < oldWords.length) {
          diff.push({ type: 'removed', value: oldWords[i] });
          i++;
        }
        if (j < newWords.length) {
          diff.push({ type: 'added', value: newWords[j] });
          j++;
        }
      }
    }
  }

  return diff;
}
