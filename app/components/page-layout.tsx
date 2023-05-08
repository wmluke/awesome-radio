import { RadioIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Link, NavLink } from "@remix-run/react";
import type { RemixLinkProps, RemixNavLinkProps } from "@remix-run/react/dist/components";
import type { ReactNode } from "react";
import * as React from "react";
import { createContext, useContext } from "react";
import type { StationWithTagsClientSide } from "~/models/station.server";
import type { TagWithStationsClientSide } from "~/models/tag.server";
import type { UserWithFavoriteStationsClientSide } from "~/models/user.server";

export type PageLayoutProps = {
    children: ReactNode;
    tags: TagWithStationsClientSide[];
    user?: UserWithFavoriteStationsClientSide;
    station: StationWithTagsClientSide | null;
}

export type StationContextType = {
    station: StationWithTagsClientSide | null
}

const StationContext = createContext<StationContextType>({ station: null });

export function useStationContext() {
    return useContext(StationContext);
}


export function ListenLink(props: RemixLinkProps & React.RefAttributes<HTMLAnchorElement>) {
    const { station } = useStationContext();
    const url = props.to + (station ? `?station=${station.id}` : "");
    return <Link {...props} to={url}>{props.children}</Link>;
}

export function ListenNavLink(props: RemixNavLinkProps & React.RefAttributes<HTMLAnchorElement>) {
    const { station } = useStationContext();
    const url = props.to + (station ? `?station=${station.id}` : "");
    return <NavLink {...props} to={url}>{props.children}</NavLink>;
}

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

export function PageLayout({ children, tags, user, station }: PageLayoutProps) {

    return (
        <StationContext.Provider value={{ station }}>
            <div className="drawer drawer-mobile">
                <input id="primary-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <div className="w-full navbar bg-base-300 lg:justify-end">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="primary-drawer" className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     className="inline-block w-6 h-6 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex-1 px-2 mx-2 gap-2 lg:hidden">
                            <RadioIcon className="h-8 w-8 p-0" />
                            <h1 className="text-2xl p-0">Awesome Radio</h1>
                        </div>
                        <div className="flex-none">
                            {user ?
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                                        <UserCircleIcon className="w-8 h-8" />
                                    </label>
                                    <ul tabIndex={0}
                                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-30">
                                        <li>
                                            <Link to="/logout">Logout</Link>
                                        </li>
                                    </ul>
                                </div> :
                                <Link to="/join" className="btn">Join</Link>
                            }

                        </div>
                    </div>
                    <div className="py-2 px-6">
                        {children}
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="primary-drawer" className="drawer-overlay"></label>
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

                </div>
            </div>
        </StationContext.Provider>
    );
}
