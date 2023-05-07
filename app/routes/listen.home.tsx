import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { StationsGallery } from "~/components/stations-gallery";
import type { StationWithTags } from "~/models/station.server";
import { getStations } from "~/models/station.server";


export async function loader() {
    const stations: StationWithTags[] = await getStations();
    return json({ stations });
}

export default function ListenHome() {
    const { stations } = useLoaderData<typeof loader>();

    return (
        <>
            <Breadcrumbs>
                <Link to="/listen">Home</Link>
            </Breadcrumbs>
            <StationsGallery stations={stations} />
            <Outlet />
        </>
    );

}
