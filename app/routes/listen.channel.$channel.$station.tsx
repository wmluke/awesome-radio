import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
        <div className="fixed bottom-0 left-0 w-full h-[70px] px-4 py-2 z-50 flex justify-end"
             data-theme="aqua">

            <audio controls autoPlay src={station.streamUrl}>
                Your browser does not support the audio element.
            </audio>
        </div>
    );

}
