import { RadioIcon } from "@heroicons/react/24/solid";
import { NavLink } from "@remix-run/react";
import { ListenNavLink } from "~/components/page-layout";
import type { TagWithStationsClientSide } from "~/models/tag.server";
import type { UserWithFavoriteStationsClientSide } from "~/models/user.server";

export type ManageContentNavProps = {
    user?: UserWithFavoriteStationsClientSide;
};

export function ManageContentNav({ user }: ManageContentNavProps) {
    if (!user) {
        return <></>;
    }
    return (
        <>
            <li className="menu-title">
                <span>Manage Content</span>
            </li>
            <li>
                <NavLink to="/listen/sources">Sources</NavLink>
            </li>
        </>
    );
}

export type SideNavProps = {
    tags: TagWithStationsClientSide[];
    user?: UserWithFavoriteStationsClientSide;
};

export function SideNav({ tags, user }: SideNavProps) {
    return (
        <ul className="menu menu-compact flex w-80 flex-col bg-base-200 text-base-content p-0 px-4 pt-4">
            <li className="flex flex-row justify-start gap-2 mb-4">
                <RadioIcon className="h-8 w-8 p-0" />
                <h1 className="text-2xl p-0">Awesome Radio</h1>
            </li>
            <li className="menu-title">
                <span>Listen</span>
            </li>
            <li>
                <ListenNavLink to="/listen" end>Home</ListenNavLink>
            </li>
            <li className="menu-title">
                <span>Tags</span>
            </li>
            {tags
                .filter(tag => tag.stations.length > 0)
                .map((tag) => {
                    return (
                        <li key={tag.slug}>
                            <ListenNavLink to={`/listen/tag/${tag.slug}`} className="capitalize">
                                {tag.name}
                                <span className="badge badge-outline">{tag.stations?.length ?? 0}</span>
                            </ListenNavLink>
                        </li>
                    );
                })}
            <ManageContentNav user={user} />
        </ul>
    );
}
