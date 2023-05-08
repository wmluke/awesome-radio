import { PlayIcon } from "@heroicons/react/24/solid";
import type { Tag } from "@prisma/client";
import { Link } from "@remix-run/react";
import { ListenLink } from "~/components/page-layout";
import type { StationWithTagsClientSide } from "~/models/station.server";
import type { Channel } from "~/routes/listen.channel.$channel";
import type { ConvertDatesToStrings } from "~/utils";

export type StationsGalleryProps = {
    stations: StationWithTagsClientSide[];
    tag?: ConvertDatesToStrings<Tag>;
    channel?: ConvertDatesToStrings<Channel>;
};

export function StationsGallery({ stations, tag, channel }: StationsGalleryProps) {

    function getStationUrl(id: string): string {
        if (channel) {
            return `/listen/channel/${channel.slug}?station=${id}`;
        }
        if (tag) {
            return `/listen/tag/${tag?.slug}?station=${id}`;
        }
        return `/listen?station=${id}`;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {stations.map((station) => {
                return (
                    <div key={station.id} className="card card-compact bg-base-100 shadow-xl mb-[70px]">
                        <figure><img src={station.imgUrl} alt="Radio Station" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {station.name}
                            </h2>
                            <h2 className="flex gap-1">
                                {station.tags.map((t, id) => {
                                    return <ListenLink key={id} to={`/listen/tag/${t.tag.slug}`}
                                                       className="badge badge-secondary">{t.tag.name}</ListenLink>;
                                })}
                            </h2>
                            <p>{station.description}</p>
                            <div className="card-actions justify-end">
                                <Link to={getStationUrl(station.id)} className="btn btn-primary gap-2">
                                    <PlayIcon className="h-6 w-6" />
                                    Listen Now
                                </Link>
                            </div>
                        </div>
                    </div>
                );

            })}
        </div>
    );
}
