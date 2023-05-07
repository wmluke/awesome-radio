import { RadioIcon } from "@heroicons/react/24/solid";
import { NavLink } from "@remix-run/react";
import type { ReactNode } from "react";

export type PageLayoutProps = {
    children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
    return (
        <div className="drawer drawer-mobile">
            <input id="primary-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <div className="w-full navbar bg-base-300">
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
                    <div className="flex-none hidden lg:block">
                        <ul className="menu menu-horizontal">
                            <li><a>Topnav Item 1</a></li>
                            <li><a>Topnav Item 2</a></li>
                        </ul>
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
                        <NavLink to="/listen/home">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/listen/channel/music">Music</NavLink>
                    </li>
                    <li>
                        <NavLink to="/listen/channel/news">News & Talk</NavLink>
                    </li>
                    <li className="menu-title">
                        <span>Manage Content</span>
                    </li>
                    <li>
                        <NavLink to="/sources">Sources</NavLink>
                    </li>

                </ul>

            </div>
        </div>
    );
}
