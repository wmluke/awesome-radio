import { describe, expect, it } from "vitest";
import { slugify, validateEmail } from "./utils";


describe("utils", () => {
    describe("validateEmail", () => {
        it("should returns false for non-emails", () => {
            expect(validateEmail(undefined)).toBe(false);
            expect(validateEmail(null)).toBe(false);
            expect(validateEmail("")).toBe(false);
            expect(validateEmail("not-an-email")).toBe(false);
            expect(validateEmail("n@")).toBe(false);
        });

        it("should returns true for emails", () => {
            expect(validateEmail("kody@example.com")).toBe(true);
        });
    });

    describe("slugify", () => {
        it("should convert text into url safe text", () => {
            expect(slugify("Abc dEf")).toBe("abc-def");
            expect(slugify("  abc def ")).toBe("abc-def");
            expect(slugify("abcDef")).toBe("abcdef");
            expect(slugify("abc.def")).toBe("abcdef");
            expect(slugify("abc!def")).toBe("abcdef");
            expect(slugify("abcdëf")).toBe("abcdef");
            expect(slugify("abc--def")).toBe("abc-def");
            expect(slugify("abc&def")).toBe("abc-and-def");
            expect(slugify("abc12def")).toBe("abc12def");
            expect(slugify("abc_def")).toBe("abc-def");
        });
    });
});




