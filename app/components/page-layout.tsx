import { Link, NavLink } from "@remix-run/react";
import type { RemixLinkProps, RemixNavLinkProps } from "@remix-run/react/dist/components";
import type { ReactNode, RefAttributes } from "react";
import { createContext, useContext } from "react";
import { SideNav } from "~/components/side-nav";
import { TopNavbar } from "~/components/top-navbar";
import type { StationWithTagsClientSide } from "~/models/station.server";
import type { TagWithStationsClientSide } from "~/models/tag.server";
import type { UserWithFavoriteStationsClientSide } from "~/models/user.server";

export type StationContextType = {
    station: StationWithTagsClientSide | null
}

export const StationContext = createContext<StationContextType>({ station: null });

/**
 * Hook that provides the active radio station.  Station is null if one is not selected.
 */
export function useStationContext() {
    return useContext(StationContext);
}

/**
 * Helper component that wraps <Link> and appends `?station={station.id}` to the link `to` prop if
 * there's an active station playing
 */
export function ListenLink(props: RemixLinkProps & RefAttributes<HTMLAnchorElement>) {
    const { station } = useStationContext();
    const url = props.to + (station ? `?station=${station.id}` : "");
    return <Link {...props} to={url}>{props.children}</Link>;
}

/**
 * Helper component that wraps <NavLink> and appends `?station={station.id}` to the link `to` prop if
 * there's an active station playing
 */
export function ListenNavLink(props: RemixNavLinkProps & RefAttributes<HTMLAnchorElement>) {
    const { station } = useStationContext();
    const url = props.to + (station ? `?station=${station.id}` : "");
    return <NavLink {...props} to={url}>{props.children}</NavLink>;
}

export type PageLayoutProps = {
    children: ReactNode;
    tags: TagWithStationsClientSide[];
    user?: UserWithFavoriteStationsClientSide;
    station: StationWithTagsClientSide | null;
}

export function PageLayout({ children, tags, user, station }: PageLayoutProps) {
    return (
        <StationContext.Provider value={{ station }}>
            <div className="drawer drawer-mobile">
                <input id="primary-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <TopNavbar user={user} />
                    <div className="py-2 px-6">
                        {children}
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="primary-drawer" className="drawer-overlay"></label>
                    <SideNav tags={tags} user={user} />
                </div>
            </div>
        </StationContext.Provider>
    );
}
