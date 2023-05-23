import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  it('create an instance', () => {
    const pipe = new HighlightPipe();
    expect(pipe).toBeTruthy();
  });

  it('should highlight part', () => {
    const pipe = new HighlightPipe();
    expect(pipe.transform("Entertainment", "en")).toBe("<span class=\"highlight\">En</span>tertainm<span class=\"highlight\">en</span>t")
  });

  it('should highlight nothing when no term provided', () => {
    const pipe = new HighlightPipe();
    expect(pipe.transform("Entertainment", "")).toBe("Entertainment")
  });

  it('should highlight nothing if term does not match', () => {
    const pipe = new HighlightPipe();
    expect(pipe.transform("Entertainment", "qq")).toBe("Entertainment")
  });
});
