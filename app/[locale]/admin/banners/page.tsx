"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, MoreHorizontal, ImageIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { createBanner, getBanners, deleteBanner, toggleBannerStatus } from "@/actions/banners";
import { Banner } from "@prisma/client";

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form states
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");

    // Fetch banners on load
    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const data = await getBanners();
            setBanners(data);
        } catch (error) {
            toast.error("Failed to load banners");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!title || !image) {
            toast.error("Title and Image are required");
            return;
        }

        toast.promise(
            createBanner({
                title,
                image,
                link,
                type: "MAIN",
                isActive: true,
                order: banners.length + 1
            }).then(() => {
                setIsCreateOpen(false);
                setTitle("");
                setLink("");
                setImage("");
                loadBanners();
            }),
            {
                loading: 'Creating banner...',
                success: 'Banner created successfully',
                error: 'Failed to create banner'
            }
        );
    };

    const handleDelete = async (id: string) => {
        toast.promise(
            deleteBanner(id).then(loadBanners),
            {
                loading: 'Deleting banner...',
                success: 'Banner deleted',
                error: 'Failed to delete banner'
            }
        );
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setBanners(banners.map(b => b.id === id ? { ...b, isActive: !currentStatus } : b));

        try {
            await toggleBannerStatus(id, !currentStatus);
        } catch (error) {
            // Revert on error
            setBanners(banners.map(b => b.id === id ? { ...b, isActive: currentStatus } : b));
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Banner Pictures</h1>
                    <p className="text-slate-400 mt-1">Manage store banners and promotional images</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Banner
                </Button>
            </div>

            {/* Banners List */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-[#1e293b]">
                        <TableRow className="border-b border-[#1e293b] hover:bg-transparent">
                            <TableHead className="text-slate-300 font-medium">Image</TableHead>
                            <TableHead className="text-slate-300 font-medium">Title & Link</TableHead>
                            <TableHead className="text-slate-300 font-medium">Type</TableHead>
                            <TableHead className="text-slate-300 font-medium">Status</TableHead>
                            <TableHead className="text-slate-300 font-medium">Order</TableHead>
                            <TableHead className="text-right text-slate-300 font-medium">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="border-b border-[#1e293b] hover:bg-transparent">
                                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                                    Loading banners...
                                </TableCell>
                            </TableRow>
                        ) : banners.length === 0 ? (
                            <TableRow className="border-b border-[#1e293b] hover:bg-transparent">
                                <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-slate-500" />
                                        </div>
                                        <p>No banners found. Create your first banner to get started.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            banners.map((banner) => (
                                <TableRow key={banner.id} className="border-b border-[#1e293b] hover:bg-[#1e293b]/50">
                                    <TableCell>
                                        <div className="relative w-24 h-12 rounded-md overflow-hidden bg-[#020817]">
                                            <Image
                                                src={banner.image}
                                                alt={banner.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">{banner.title}</span>
                                            {banner.link && (
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <ExternalLink className="w-3 h-3" />
                                                    {banner.link}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-[#1e293b] text-slate-300 hover:bg-[#1e293b]">
                                            {banner.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={banner.isActive}
                                            onCheckedChange={() => handleToggleStatus(banner.id, banner.isActive)}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-slate-400">{banner.order}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#1e293b] border-[#020817] text-slate-200">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="focus:bg-[#020817] focus:text-white cursor-pointer">
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-[#020817]" />
                                                <DropdownMenuItem
                                                    className="text-red-400 focus:bg-red-900/20 focus:text-red-300 cursor-pointer"
                                                    onClick={() => handleDelete(banner.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-[#0f172a] border-[#1e293b] text-white sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Banner</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Add a new banner picture to your store.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="image">Banner Image</Label>
                            <div className="border-2 border-dashed border-[#1e293b] rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-600/50 transition-colors">
                                {image ? (
                                    <div className="relative w-full aspect-video rounded overflow-hidden">
                                        <Image src={image} alt="Preview" fill className="object-cover" />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6"
                                            onClick={() => setImage("")}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res: any) => {
                                                if (res && res[0]) {
                                                    setImage(res[0].url);
                                                    toast.success("Image uploaded!");
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                toast.error(`Upload failed: ${error.message}`);
                                            }}
                                            appearance={{
                                                button: "bg-[#1e293b] text-white hover:bg-[#334155] ut-uploading:cursor-not-allowed"
                                            }}
                                        />
                                        <p className="text-xs text-slate-500 mt-2">Recommended: 1920x600px</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600"
                                placeholder="Summer Sale"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="link">Link URL</Label>
                            <Input
                                id="link"
                                value={link}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                                className="bg-[#1e293b] border-[#020817] text-white focus-visible:ring-blue-600"
                                placeholder="/products/sale"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white hover:bg-[#1e293b]">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">Create Banner</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
