export type Token = "," | "." | "<" | ">" | "+" | "-" | "[" | "]";

export type AST =
  | { tag: "," }
  | { tag: "." }
  | { tag: "<" }
  | { tag: ">" }
  | { tag: "+" }
  | { tag: "-" }
  | { tag: "["; pos: number }
  | { tag: "]"; pos: number };

export function compile(tokens: Token[]): AST[] {
  const ast: AST[] = [];
  const loopStack: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tag = tokens[i];
    switch (tag) {
      case "+":
      case "-":
      case ",":
      case ".":
      case "<":
      case ">":
        ast.push({ tag });
        break;
      case "[":
        loopStack.push(i);
        ast.push({ tag: "[", pos: -1 });
        break;
      case "]":
        {
          const loopStart = loopStack.pop();
          if (loopStart === undefined) {
            throw new Error("Unmatched loop");
          }
          ast.push({ tag: "]", pos: loopStart });
          const matchingBracket = ast[loopStart];
          if (matchingBracket.tag !== "[") {
            throw new Error("Unmatched loop");
          }
          matchingBracket.pos = i;
        }
        break;
    }
  }
  return ast;
}

export function isBalanced(tokens: Token[]): boolean {
  const loopStack: number[] = [];
  for (const token of tokens) {
    if (token === "[") {
      loopStack.push(0);
    } else if (token === "]") {
      if (loopStack.length === 0) {
        return false;
      }
      loopStack.pop();
    }
  }
  return loopStack.length === 0;
}
