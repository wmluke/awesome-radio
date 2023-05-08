import type { LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
    await requireUser(request);
    return null;
}

export default function SourceLayout() {
    return (
        <Outlet />
    );
}
