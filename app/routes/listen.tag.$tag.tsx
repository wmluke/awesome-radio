import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { ListenLink } from "~/components/page-layout";
import { StationsGallery } from "~/components/stations-gallery";
import type { StationWithTags } from "~/models/station.server";
import { findStationsByTags } from "~/models/station.server";
import { findTagBySlug } from "~/models/tag.server";
import { notFound } from "~/utils";


export async function loader({ params, request }: LoaderArgs) {
    if (!params.tag) {
        throw notFound();
    }

    const tag = await findTagBySlug(params.tag);
    if (!tag) {
        throw notFound();
    }

    const url = new URL(request.url);
    const q = url.searchParams.get("q");

    const stations: StationWithTags[] = await findStationsByTags([tag.name], q);

    return json({ tag, stations });


}

export default function ListenTag() {
    const { tag, stations } = useLoaderData<typeof loader>();
    return (
        <>
            <Breadcrumbs>
                <ListenLink to="/listen">Home</ListenLink>
                <ListenLink to={`/listen/${tag.slug}`} className="capitalize">{tag.name}</ListenLink>
            </Breadcrumbs>
            <StationsGallery stations={stations} tag={tag} />
            <Outlet />
        </>
    );
}
