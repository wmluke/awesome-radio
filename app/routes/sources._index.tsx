import { PlusSmallIcon } from "@heroicons/react/24/solid";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { getSources } from "~/models/source.server";

export async function loader() {
    const sources = await getSources();

    return json({ sources });
}

export default function SourceIndex() {
    const { sources } = useLoaderData<typeof loader>();

    return (
        <>
            <Breadcrumbs>
                <Link to="/sources">Sources</Link>
                <Link to="/sources/new">
                    <PlusSmallIcon className="w-4 h-4 mr-2 stroke-current" />
                    Add Source
                </Link>
            </Breadcrumbs>
            <ul className="menu bg-base-100 w-56">
                {sources.map(source => {
                    return (
                        <li key={source.id}><Link to={"/sources/" + source.id}>{source.name}</Link></li>
                    );
                })}
            </ul>
        </>
    );
}
