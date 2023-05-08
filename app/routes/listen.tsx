import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { PageLayout } from "~/components/page-layout";
import { StationPlayer } from "~/components/station-player";
import type { StationWithTags } from "~/models/station.server";
import { getStationById } from "~/models/station.server";
import type { TagWithStations } from "~/models/tag.server";
import { getTags } from "~/models/tag.server";
import { getUser } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
    const tags: TagWithStations[] = await getTags();
    const user = await getUser(request);
    const url = new URL(request.url);
    const stationId = url.searchParams.get("station");
    const station: StationWithTags | null = stationId ? await getStationById(stationId) : null;
    return json({ user, tags, station });
}

export default function ListenLayout() {
    const { tags, user, station } = useLoaderData<typeof loader>();
    return (
        <PageLayout tags={tags} user={user} station={station}>
            <Outlet />
            <StationPlayer station={station} />
        </PageLayout>
    );
}
