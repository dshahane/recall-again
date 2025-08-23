'use client'

import React from 'react'
import Link from 'next/link'

export default function ProjectsListPage() {
    const projects = [
        { name: 'Project A', slug: 'project-a' },
        { name: 'Project B', slug: 'project-b' },
        { name: 'Project C', slug: 'project-c' },
    ]

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Projects</h2>
            <ul className="flex flex-col gap-2">
                {projects.map((project) => (
                    <li key={project.slug}>
                        <Link
                            href={`/projects/${project.slug}`}
                            className="text-blue-600 hover:underline"
                        >
                            {project.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
