import type { Tag } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { StationWithTags } from "~/models/station.server";
import type { Channel } from "~/routes/listen.channel.$channel";
import type { ConvertDatesToStrings } from "~/utils";

export type StationsGalleryProps = {
    stations: ConvertDatesToStrings<NonNullable<StationWithTags>>[];
    tag?: ConvertDatesToStrings<Tag>;
    channel?: ConvertDatesToStrings<Channel>;
};

export function StationsGallery({ stations, tag, channel }: StationsGalleryProps) {

    function getStationUrl(id: string): string {
        if (channel) {
            return `/listen/channel/${channel.slug}/${id}`;
        }
        if (tag) {
            return `/listen/tag/${tag?.slug}/${id}`;
        }
        return `/listen/station/${id}`;
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {stations.map((station) => {
                return (
                    <div key={station.id} className="card card-compact bg-base-100 shadow-xl">
                        <figure><img src={station.imgUrl} alt="Radio Station" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {station.name}
                            </h2>
                            <h2 className="flex gap-1">
                                {station.tags.map((t, id) => {
                                    return <Link key={id} to={`/listen/tag/${t.tag.slug}`}
                                                 className="badge badge-secondary">{t.tag.name}</Link>;
                                })}
                            </h2>
                            <p>{station.description}</p>
                            <div className="card-actions justify-end">
                                <Link to={getStationUrl(station.id)} className="btn btn-primary">Listen Now</Link>
                            </div>
                        </div>
                    </div>
                );

            })}
        </div>
    );
}
