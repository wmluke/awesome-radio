import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { StationsGallery } from "~/components/stations-gallery";
import type { StationWithTags } from "~/models/station.server";
import { findStationsByTags } from "~/models/station.server";
import { findTagBySlug } from "~/models/tag.server";
import { notFound } from "~/utils";


export async function loader({ params }: LoaderArgs) {
    if (!params.tag) {
        throw notFound();
    }

    const tag = await findTagBySlug(params.tag);
    if (!tag) {
        throw notFound();
    }

    const stations: NonNullable<StationWithTags>[] = await findStationsByTags([tag.name]);

    return json({ tag, stations });


}

export default function ListenTag() {
    const { tag, stations } = useLoaderData<typeof loader>();
    return (
        <>
            <Breadcrumbs>
                <Link to="/listen">Home</Link>
                <Link to={`/listen/${tag.slug}`} className="capitalize">{tag.name}</Link>
            </Breadcrumbs>
            <StationsGallery stations={stations} />
        </>
    );
}
