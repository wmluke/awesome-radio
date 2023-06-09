import type { ContentSource } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { importSource } from "~/lib/importer.server";
import { getSource, saveSource } from "~/models/source.server";
import { requireUser } from "~/session.server";
import { notFound } from "~/utils";


export async function action({ request }: ActionArgs) {
    await requireUser(request);
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const connectionUrl = formData.get("connectionUrl") as string;
    const source = await saveSource({ id, name, description, type, connectionUrl });
    await importSource(source);
    return redirect("/listen/sources");
}

export async function loader({ params, request }: LoaderArgs) {
    await requireUser(request);
    const { id } = params;
    if (!id) {
        throw notFound();
    }
    const source = id !== "new" ? await getSource(id) : {
        type: "json"
    } as ContentSource;
    if (!source) {
        throw notFound();
    }
    return json({ source });
}


export default function SourcePage() {
    const { source } = useLoaderData<typeof loader>();

    return (
        <>
            <Breadcrumbs>
                <Link to="/listen/sources">Sources</Link>
                <Link to={`/listen/sources/${source.id}`}>{source.name ?? "New Source"}</Link>
            </Breadcrumbs>
            <form method="post">
                <input type="hidden" name="id" value={source.id} />
                <div className="form-control w-full max-w-lg">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input type="text" name="name" placeholder="Type here"
                           className="input input-bordered w-full"
                           defaultValue={source.name} />
                </div>
                <div className="form-control w-full max-w-lg">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea name="description" placeholder="Type here"
                              className="textarea textarea-bordered w-full"
                              defaultValue={source.description!} />
                </div>
                <div className="form-control w-full max-w-lg">
                    <label className="label">
                        <span className="label-text">URL</span>
                    </label>
                    <input type="text" name="connectionUrl" placeholder="Type here"
                           className="input input-bordered w-full"
                           defaultValue={source.connectionUrl} />
                </div>
                <div className="form-control w-full max-w-lg">
                    <label className="label">
                        <span className="label-text">Type</span>
                    </label>
                    <input type="text" name="type" placeholder="Type here"
                           className="input input-bordered w-full"
                           readOnly
                           defaultValue={source.type} />
                </div>
                <div className="form-control w-full max-w-lg mt-3">
                    <button type="submit" className="btn btn-primary">Import Stations</button>
                </div>

            </form>
        </>
    );
}
