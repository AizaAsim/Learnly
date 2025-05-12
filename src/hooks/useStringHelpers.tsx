import capitalize from "lodash-es/capitalize";
export function useStringHelpers() {
  const titleCase = (str: string) => {
    return str
      .split(" ")
      .map((word) => (word.length > 1 ? capitalize(word) : word))
      .join(" ");
  };
  return { capitalize, titleCase };
}
