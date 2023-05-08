import type { StationWithTagsClientSide } from "~/models/station.server";

export type StationPlayerProps = {
    station: StationWithTagsClientSide | null
};

export function StationPlayer({ station }: StationPlayerProps) {
    if (!station) {
        return <></>;
    }
    return (
        <div
            className="fixed bottom-0 left-0 w-full h-[70px] px-4 py-2 z-50 flex justify-end content-center items-center gap-2 bg-accent text-accent-content">
            <h3 className="text-xl">Now Playing: <strong>{station.name}</strong></h3>

            <audio controls autoPlay src={station.streamUrl}>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}
