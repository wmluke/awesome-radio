import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import type { ReactNode } from "react";
import { PageLayout } from "~/components/page-layout";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [])
];

export const loader = async ({ request }: LoaderArgs) => {
    return json({ user: await getUser(request) });
};

export type DocumentProps = {
    children: ReactNode;
    title?: string;

}

function Document({ title, children }: DocumentProps) {
    return (
        <html lang="en" className="h-full">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            {title ? <title>{title}</title> : null}
            <Meta />
            <Links />
        </head>
        <body className="h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        </body>
        </html>
    );
}

export default function App() {
    return (
        <Document>
            <PageLayout>
                <Outlet />
            </PageLayout>
        </Document>
    );
}

export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return (
        <Document title="Uh-oh!">
            <div className="flex min-h-screen flex-1 flex-col items-center justify-center py-4">
                <h1>Sorry, something went wrong...</h1>
            </div>
        </Document>
    );
}
