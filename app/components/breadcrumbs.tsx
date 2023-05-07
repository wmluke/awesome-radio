import type { ReactNode } from "react";

export type BreadcrumbsProps = {
    children: ReactNode | ReactNode[];
}

export function Breadcrumbs({ children }: BreadcrumbsProps) {
    const links = Array.isArray(children) ? children : [children];
    return (
        <div className="text-lg breadcrumbs">
            <ul>
                {links.map((c, i) => {
                    return <li key={i}>{c}</li>;
                })}
            </ul>
        </div>
    );
}
