export interface WordleGame {
  targetWord: string;
  attempts: string[];
  maxAttempts: number;
}
export function checkGuess(guess: string, target: string): string {
  const result = new Array(5).fill("⬛");
  const targetArr = target.split("");
  const guessArr = guess.split("");

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = "🟩";
      targetArr[i] = "";
      guessArr[i] = "";
    }
  }

  for (let i = 0; i < 5; i++) {
    const letter = guessArr[i];
    if (letter !== undefined && letter !== "") {
      const foundIndex = targetArr.indexOf(letter);
      if (foundIndex !== -1) {
        result[i] = "🟨";
        targetArr[foundIndex] = "";
      }
    }
  }
  return result.join("");
}
export const wordleGames = new Map<string, WordleGame>();
