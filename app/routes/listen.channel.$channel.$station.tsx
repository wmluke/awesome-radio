import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { StationPlayer } from "~/components/station-player";
import { getStationById } from "~/models/station.server";
import { notFound } from "~/utils";


export async function loader({ params }: LoaderArgs) {
    if (!params.station) {
        throw notFound();
    }

    const station = await getStationById(params.station);
    if (!station) {
        throw notFound();
    }
    return json({ station });
}

export default function ListenChanelStation() {
    const { station } = useLoaderData<typeof loader>();
    return (
        <StationPlayer station={station} />
    );

}
