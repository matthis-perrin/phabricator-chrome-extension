export interface LevenshtienSearchResult {
  steps: number
  relative: number
  similarity: number
}

export function levenshtien(needle: string, haystack: string, limit?: number): LevenshtienSearchResult {
  const needleLength = needle.length
  const haystackLength = haystack.length
  const matrix: number[][] = []


  function prepare(steps: number): LevenshtienSearchResult {
    var length = Math.max(needleLength, haystackLength)
    var relative = length === 0 ? 0 : steps / length
    var similarity = 1 - relative
    return {steps, relative, similarity}
  }

  // If the limit is not defined it will be calculate from needle and haystack args.
  limit = limit || Math.max(needleLength, haystackLength) + 1

  for (var i = 0; i < limit; i++) {
    matrix[i] = [i]
    matrix[i].length = limit
  }
  for (i = 0; i < limit; i++) {
    matrix[0][i] = i
  }

  if (Math.abs(needleLength - haystackLength) > (limit || 100)){
    return prepare(limit || 100)
  }
  if (needleLength === 0){
    return prepare(haystackLength)
  }
  if (haystackLength === 0){
    return prepare(needleLength)
  }

  // Calculate matrix.
  let needleI = ""
  let haystackJ = ""
  let cost = 0
  let min = 0
  let t = 0
  for (var i = 1; i <= needleLength; ++i) {
    needleI = needle[i-1];

    // Step 4
    for (var j = 1; j <= haystackLength; ++j) {
      // Check the jagged ld total so far
      if (i === j && matrix[i][j] > 4) return prepare(needleLength);

      haystackJ = haystack[j-1];
      cost = (needleI === haystackJ) ? 0 : 1; // Step 5
      // Calculate the minimum (much faster than Math.min(...)).
      min    = matrix[i - 1][j    ] + 1; // Deletion.
      if ((t = matrix[i    ][j - 1] + 1   ) < min) min = t;   // Insertion.
      if ((t = matrix[i - 1][j - 1] + cost) < min) min = t;   // Substitution.

      // Update matrix.
      matrix[i][j] = (i > 1 && j > 1 && needleI === haystack[j-2] && needle[i-2] === haystackJ && (t = matrix[i-2][j-2]+cost) < min) ? t : min; // Transposition.
    }
  }

  return prepare(matrix[needleLength][haystackLength]);
};
