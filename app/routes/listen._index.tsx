import { Link } from "@remix-run/react";
import { Breadcrumbs } from "~/components/breadcrumbs";

export default function ListenHome() {
    return (
        <>
            <Breadcrumbs>
                <Link to="/listen">Home</Link>
            </Breadcrumbs>
        </>
    );

}
