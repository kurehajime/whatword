import word_english2048 from '../dictionary/english2048.json'

export function getWord(): string {
    const index = Math.floor(Math.random() * word_english2048.length);
    return word_english2048[index];
}