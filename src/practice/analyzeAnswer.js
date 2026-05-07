function normalizeLine(line) {
  return line
    .trim()
    .replace(/^console\.log\((.*)\);?$/i, "$1")
    .replace(/^["'`](.*)["'`]$/g, "$1")
    .replace(/\s+/g, " ");
}

export function normalizeOutput(text, expectedLineCount = 1) {
  const separator = text.includes("\n") || expectedLineCount === 1 ? /\n/ : /,/;
  return text
    .split(separator)
    .filter((line) => line.trim().length > 0)
    .map(normalizeLine);
}

export function analyzePracticeAnswer(question, outputText, reasoningText) {
  const actual = normalizeOutput(outputText, question.expectedOutput.length);
  const expected = question.expectedOutput.map(normalizeLine);
  const correctLines = expected.filter((line, index) => actual[index] === line).length;
  const exactOutput = actual.length === expected.length && correctLines === expected.length;
  const outputScore = expected.length === 0 ? 0 : Math.round((correctLines / expected.length) * 60);
  const reasoning = reasoningText.toLowerCase();
  const matchedKeywords = question.reasoningKeywords.filter((keyword) => reasoning.includes(keyword.toLowerCase()));
  const reasoningScore = Math.min(40, matchedKeywords.length * 10);
  const score = exactOutput ? Math.max(70, outputScore + reasoningScore) : outputScore + reasoningScore;

  const misses = question.reasoningKeywords.filter((keyword) => !matchedKeywords.includes(keyword));

  return {
    score,
    exactOutput,
    actual,
    expected,
    matchedKeywords,
    misses,
    verdict:
      score >= 85
        ? "Strong answer"
        : score >= 60
          ? "Close, but tighten the reasoning"
          : "Needs another pass",
    feedback: exactOutput
      ? "Your output order matches. Now make sure your reasoning names the mechanism that caused it."
      : "The output does not fully match yet. Re-check the execution order and when callbacks enter queues."
  };
}
