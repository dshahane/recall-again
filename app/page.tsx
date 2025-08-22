'use client'

import {DashboardPage} from "@/app/dashboard/page";
import {usePageInfo} from "@/app/context/page-context";
import {useEffect} from "react";

export default function Page() {
    const { setPageInfo } = usePageInfo()

    useEffect(() => {
        setPageInfo('Home', [
        ])
    }, [setPageInfo])

    return (
        <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <DashboardPage/>
        </div>
    )
}
