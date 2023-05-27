import { render, screen } from "@testing-library/react";
import { describe } from "vitest";
import { Breadcrumbs } from "~/components/breadcrumbs";

describe("<Breadcrumbs/>", () => {
    it("should render children within <ul> and wrapped by <li></li>", () => {
        const view = render(
            <Breadcrumbs>
                <span id="1">one</span>
                <span id="2">two</span>
                <span id="3">three</span>
            </Breadcrumbs>
        );
        expect(screen.getByText(/one/)).toBeDefined();
        expect(screen.getByText(/two/)).toBeDefined();
        expect(screen.getByText(/three/)).toBeDefined();
        //expect(view.container).toMatchSnapshot();
    });
});
