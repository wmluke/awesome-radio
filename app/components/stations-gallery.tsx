import { Link } from "@remix-run/react";
import type { ConvertDatesToStrings } from "@remix-run/router/utils";
import type { StationWithTags } from "~/models/station.server";

export type StationsGalleryProps = {
    stations: ConvertDatesToStrings<NonNullable<StationWithTags>>[]
};

export function StationsGallery({ stations }: StationsGalleryProps) {
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
                                <button className="btn btn-primary">Listen Now</button>
                            </div>
                        </div>
                    </div>
                );

            })}
        </div>
    );
}
