import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { StationsGallery } from "~/components/stations-gallery";
import type { StationWithTags } from "~/models/station.server";
import { findStationsByTags } from "~/models/station.server";
import { notFound } from "~/utils";


export type Channel = {
    tags: string[];
    slug: string;
    name: string;
}

const channels: { [channel: string]: Channel } = {
    "music": {
        tags: ["music"],
        slug: "music",
        name: "Music"
    },
    "news": {
        tags: ["news"],
        slug: "news",
        name: "News"
    }
};


export async function loader({ params }: LoaderArgs) {
    if (!params.channel) {
        throw notFound();
    }

    const channel = channels[params.channel];
    if (!channel) {
        throw notFound();
    }

    const stations: StationWithTags[] = await findStationsByTags(channel.tags);
    return json({ channel, stations });
}

export default function ListenChannel() {
    const { channel, stations } = useLoaderData<typeof loader>();

    return (
        <>
            <Breadcrumbs>
                <Link to="/listen">Home</Link>
                <Link to={`/listen/${channel.slug}`}>{channel.name}</Link>
            </Breadcrumbs>
            <StationsGallery stations={stations} channel={channel} />
            <Outlet />
        </>
    );

}
