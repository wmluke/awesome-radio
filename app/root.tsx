import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
    isRouteErrorResponse,
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError
} from "@remix-run/react";
import type { ReactNode } from "react";
import { PageLayout } from "~/components/page-layout";
import { getTags, TagWithStations } from "~/models/tag.server";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [])
];

export async function loader({ request }: LoaderArgs) {
    const tags: TagWithStations[] = await getTags();
    const user = await getUser(request);
    return json({ user, tags });
};

export type DocumentProps = {
    children: ReactNode;
    title?: string;

}

export function Document({ title, children }: DocumentProps) {
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
    const { tags, user } = useLoaderData<typeof loader>();
    return (
        <Document>
            <PageLayout tags={tags} user={user}>
                <Outlet />
            </PageLayout>
        </Document>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    console.error(error);

    if (isRouteErrorResponse(error)) {
        const title = `${error.status} - ${error.statusText}`;
        return (
            <Document title={title}>
                <div className="container mx-auto p-4 prose w-full">
                    <h1>{title}</h1>
                </div>
            </Document>
        );
    }

    if (error instanceof Error) {
        return (
            <Document title="Uh-oh!">
                <div className="container mx-auto p-4 prose w-full">
                    <h2>Yikes!</h2>
                    <div className="alert alert-error shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6"
                                 fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error.message}</span>
                        </div>
                    </div>
                    <h2>Stack Trace</h2>
                    <div className="mockup-code">
                        <pre data-prefix="!!!"><code>{error.stack}</code></pre>
                    </div>
                </div>
            </Document>
        );
    }

    return (
        <Document title="Uh-oh!">
            <div className="container mx-auto p-4 prose w-full">
                <h1>Sorry, something went wrong...</h1>
            </div>
        </Document>
    );
}
