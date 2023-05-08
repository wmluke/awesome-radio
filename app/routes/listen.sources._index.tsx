import { PlusSmallIcon } from "@heroicons/react/24/solid";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { getSources } from "~/models/source.server";
import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
    await requireUser(request);
    const sources = await getSources();

    return json({ sources });
}

export default function SourceIndex() {
    const { sources } = useLoaderData<typeof loader>();

    return (
        <>
            <Breadcrumbs>
                <Link to="/listen/sources">Sources</Link>
                <Link to="/listen/sources/new">
                    <PlusSmallIcon className="w-4 h-4 mr-2 stroke-current" />
                    Add Source
                </Link>
            </Breadcrumbs>
            <table className="table table-compact w-full">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Connection URL</th>
                </tr>
                </thead>
                <tbody>
                {sources.map(source => {
                    return (
                        <tr key={source.id} className="hover">
                            <td><Link className="underline" to={"/listen/sources/" + source.id}>{source.name}</Link>
                            </td>
                            <td>{source.description}</td>
                            <td>{source.type}</td>
                            <td>{source.connectionUrl}</td>
                        </tr>
                    );
                })}

                </tbody>
            </table>
        </>
    );
}
