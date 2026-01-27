"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct, updateProduct } from "@/actions/products";
import { createFilterOption } from "@/actions/filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Percent } from "lucide-react";
import { UploadDropzone } from "@/utils/uploadthing";

interface FilterOption {
    id: string;
    value: string;
    label?: string | null;
}

interface ProductFormProps {
    categories: Category[];
    durations: FilterOption[];
    platforms: FilterOption[];
    product?: {
        id: string;
        name: string;
        nameAr?: string | null;
        slug: string;
        description: string;
        descriptionAr?: string | null;
        price: number;
        discountPercentage?: number;
        images: string[];
        categoryId: string;
        inventory: number;
        isActive: boolean;
        duration?: string | null;
        platform?: string | null;
        durationId?: string | null;
        platformId?: string | null;
    };
}

export function ProductForm({ categories, durations, platforms, product }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addingDuration, setAddingDuration] = useState(false);
    const [addingPlatform, setAddingPlatform] = useState(false);
    const [newDuration, setNewDuration] = useState("");
    const [newPlatform, setNewPlatform] = useState("");
    const [localDurations, setLocalDurations] = useState<FilterOption[]>(durations);
    const [localPlatforms, setLocalPlatforms] = useState<FilterOption[]>(platforms);

    const [formData, setFormData] = useState({
        name: product?.name || "",
        nameAr: product?.nameAr || "",
        description: product?.description || "",
        descriptionAr: product?.descriptionAr || "",
        price: product?.price?.toString() || "",
        discountPercentage: product?.discountPercentage?.toString() || "0",
        categoryId: product?.categoryId || "",
        inventory: product?.inventory?.toString() || "0",
        isActive: product?.isActive ?? true,
        durationId: product?.durationId || "", // Prefer ID
        platformId: product?.platformId || "", // Prefer ID
    });
    const [images, setImages] = useState<string[]>(product?.images || []);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const slug = product?.slug || generateSlug(formData.name);
            const data = {
                name: formData.name,
                nameAr: formData.nameAr || undefined,
                slug,
                description: formData.description,
                descriptionAr: formData.descriptionAr || undefined,
                price: parseFloat(formData.price),
                discountPercentage: parseInt(formData.discountPercentage) || 0,
                images: images,
                categoryId: formData.categoryId,
                inventory: parseInt(formData.inventory),
                isActive: formData.isActive,
                isFeatured: false,
                durationId: formData.durationId || undefined,
                duration: formData.durationId ? localDurations.find(d => d.id === formData.durationId)?.value : undefined,
                platformId: formData.platformId || undefined,
                platform: formData.platformId ? localPlatforms.find(p => p.id === formData.platformId)?.value : undefined,
            };

            if (product) {
                await updateProduct(product.id, data);
            } else {
                await createProduct(data);
            }

            router.push("/admin/products");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto mb-8">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {product ? "Edit Product" : "Create New Product"}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {product ? "Update your product details" : "Add a new product to your store"}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-snow-accent text-gray-900 hover:bg-cyan-400 font-bold"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            product ? "Update Product" : "Create Product"
                        )}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 mb-6">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-6">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-300">Product Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        });
                                    }}
                                    className="bg-white/5 border-white/10 text-white focus:border-snow-accent"
                                    placeholder="e.g. GPT Plus Subscription"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-gray-300">Description</Label>
                                <Textarea
                                    id="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-snow-accent resize-none"
                                    placeholder="Enter full product description..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Arabic Localization */}
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span className="text-lg">🌍</span> Arabic Localization
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nameAr" className="text-gray-300">Product Name (Arabic)</Label>
                                <Input
                                    id="nameAr"
                                    value={formData.nameAr}
                                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-snow-accent text-right"
                                    placeholder="اسم المنتج بالعربية"
                                    dir="rtl"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="descriptionAr" className="text-gray-300">Description (Arabic)</Label>
                                <Textarea
                                    id="descriptionAr"
                                    rows={5}
                                    value={formData.descriptionAr}
                                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-snow-accent resize-none text-right"
                                    placeholder="وصف المنتج بالعربية..."
                                    dir="rtl"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Image Preview Grid */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {images.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden group bg-black/40 border border-white/10">
                                            <Image src={url} alt={`Product ${index + 1}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Dropzone */}
                            <UploadDropzone
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    if (res) {
                                        setImages(prev => [...prev, ...res.map(f => f.url)]);
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    setError(`Upload failed: ${error.message}`);
                                }}
                                className="bg-white/5 border-white/10 border-dashed ut-label:text-snow-accent ut-button:bg-snow-accent ut-button:text-black ut-button:font-bold ut-button:hover:bg-snow-accent/90"
                            />
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Pricing</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="price" className="text-gray-300">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-snow-accent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="discountPercentage" className="text-gray-300 flex items-center gap-2">
                                    <Percent className="w-4 h-4" /> Discount
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="discountPercentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discountPercentage}
                                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white focus:border-snow-accent pr-8"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                                {parseInt(formData.discountPercentage) > 0 && formData.price && (
                                    <p className="text-xs text-green-400">
                                        Sale price: ${(parseFloat(formData.price) * (1 - parseInt(formData.discountPercentage) / 100)).toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-gray-200">Active</Label>
                                    <p className="text-xs text-gray-500">Visible in store</p>
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Organization & Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="categoryId" className="text-gray-300">Category *</Label>
                                <select
                                    id="categoryId"
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent focus:border-snow-accent cursor-pointer appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="duration" className="text-gray-300">Duration</Label>
                                    {!addingDuration && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-snow-accent h-6 px-2"
                                            onClick={() => setAddingDuration(true)}
                                        >
                                            <Plus className="w-3 h-3 mr-1" /> New
                                        </Button>
                                    )}
                                </div>
                                {addingDuration ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={newDuration}
                                            onChange={(e) => setNewDuration(e.target.value)}
                                            placeholder="e.g. 2 Years"
                                            className="flex-1 bg-white/5 border-white/10 text-white h-10"
                                            autoFocus
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-10"
                                            onClick={async () => {
                                                if (!newDuration.trim()) return;
                                                const opt = await createFilterOption({ type: "duration", value: newDuration.trim() });
                                                setLocalDurations([...localDurations, opt]);
                                                setFormData({ ...formData, durationId: opt.id });
                                                setNewDuration("");
                                                setAddingDuration(false);
                                            }}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 h-10"
                                            onClick={() => { setAddingDuration(false); setNewDuration(""); }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <select
                                        id="duration"
                                        value={formData.durationId}
                                        onChange={(e) => setFormData({ ...formData, durationId: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent cursor-pointer appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                    >
                                        <option value="">Select duration</option>
                                        {localDurations.map((d) => (
                                            <option key={d.id} value={d.id}>{d.label || d.value}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="platform" className="text-gray-300">Platform</Label>
                                    {!addingPlatform && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-snow-accent h-6 px-2"
                                            onClick={() => setAddingPlatform(true)}
                                        >
                                            <Plus className="w-3 h-3 mr-1" /> New
                                        </Button>
                                    )}
                                </div>
                                {addingPlatform ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={newPlatform}
                                            onChange={(e) => setNewPlatform(e.target.value)}
                                            placeholder="e.g. ChatGPT"
                                            className="flex-1 bg-white/5 border-white/10 text-white h-10"
                                            autoFocus
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-10"
                                            onClick={async () => {
                                                if (!newPlatform.trim()) return;
                                                const opt = await createFilterOption({ type: "platform", value: newPlatform.trim() });
                                                setLocalPlatforms([...localPlatforms, opt]);
                                                setFormData({ ...formData, platformId: opt.id });
                                                setNewPlatform("");
                                                setAddingPlatform(false);
                                            }}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-400 h-10"
                                            onClick={() => { setAddingPlatform(false); setNewPlatform(""); }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <select
                                        id="platform"
                                        value={formData.platformId}
                                        onChange={(e) => setFormData({ ...formData, platformId: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-snow-accent cursor-pointer appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                                    >
                                        <option value="">Select platform</option>
                                        {localPlatforms.map((p) => (
                                            <option key={p.id} value={p.id}>{p.label || p.value}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="grid gap-2">
                                <Label htmlFor="inventory" className="text-gray-300">Inventory</Label>
                                <Input
                                    id="inventory"
                                    type="number"
                                    min="0"
                                    value={formData.inventory}
                                    onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                                    className="bg-white/5 border-white/10 text-white focus:border-snow-accent"
                                    placeholder="0"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
