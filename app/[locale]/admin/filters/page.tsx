import { getAllFilterOptions, seedDefaultFilters } from "@/actions/filters";
import { FilterSection } from "./FilterSection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Filters | Admin | SnowX",
};

export default async function AdminFiltersPage() {
    const [durationOptions, platformOptions] = await Promise.all([
        getAllFilterOptions("duration"),
        getAllFilterOptions("platform")
    ]);

    // Seed defaults if no filters exist
    if (durationOptions.length === 0 && platformOptions.length === 0) {
        await seedDefaultFilters();
        // Refetch after seeding
        const [durations, platforms] = await Promise.all([
            getAllFilterOptions("duration"),
            getAllFilterOptions("platform")
        ]);
        return renderPage(durations, platforms);
    }

    return renderPage(durationOptions, platformOptions);
}

function renderPage(
    durationOptions: Awaited<ReturnType<typeof getAllFilterOptions>>,
    platformOptions: Awaited<ReturnType<typeof getAllFilterOptions>>
) {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Product Filters</h1>
                <p className="text-slate-400">Manage filter options shown in the products sidebar</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <FilterSection
                    title="Duration Options"
                    description="Subscription duration choices for customers"
                    type="duration"
                    options={durationOptions}
                />

                <FilterSection
                    title="Platform Options"
                    description="Service/platform filter checkboxes"
                    type="platform"
                    options={platformOptions}
                />
            </div>
        </div>
    );
}
