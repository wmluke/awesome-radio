import type { StationWithTags } from "~/models/station.server";
import type { ConvertDatesToStrings } from "~/utils";

export type StationPlayerProps = {
    station: ConvertDatesToStrings<NonNullable<StationWithTags>>
};

export function StationPlayer({ station }: StationPlayerProps) {
    return (
        <div
            className="fixed bottom-0 left-0 w-full h-[70px] px-4 py-2 z-50 flex justify-end content-center items-center gap-2"
            data-theme="aqua">
            <h3 className="text-xl">Now Playing: <strong>{station.name}</strong></h3>

            <audio controls autoPlay src={station.streamUrl}>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
