import { minimatch } from "minimatch";

export class Matcher {
  constructor(
    public readonly includes: string[],
    public readonly excludes: string[]
  ) {}
  public matches(string: string): boolean {
    const shouldInclude =
      this.includes.length === 0 ||
      this.includes.some((x) => string.includes(x));
    return shouldInclude && !this.excludes.some((x) => string.includes(x));
  }
}
