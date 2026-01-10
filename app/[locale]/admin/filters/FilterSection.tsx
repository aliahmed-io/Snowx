"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFilterOption, updateFilterOption, deleteFilterOption } from "@/actions/filters";
import { Pencil, Trash2, Plus, Check, X, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface FilterOption {
    id: string;
    type: string;
    value: string;
    label: string | null;
    order: number;
    isActive: boolean;
}

interface FilterSectionProps {
    title: string;
    description: string;
    type: "duration" | "platform";
    options: FilterOption[];
}

export function FilterSection({ title, description, type, options }: FilterSectionProps) {
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [newValue, setNewValue] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    const handleAdd = async () => {
        if (!newValue.trim()) return;
        setLoading("add");
        try {
            await createFilterOption({
                type,
                value: newValue.trim(),
                order: options.length
            });
            setNewValue("");
            setIsAdding(false);
            router.refresh();
            toast.success(`${type === "duration" ? "Duration" : "Platform"} added`);
        } catch (error) {
            toast.error("Failed to add option");
        } finally {
            setLoading(null);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editValue.trim()) return;
        setLoading(id);
        try {
            await updateFilterOption(id, { value: editValue.trim(), label: editValue.trim() });
            setEditingId(null);
            router.refresh();
            toast.success("Option updated");
        } catch (error) {
            toast.error("Failed to update option");
        } finally {
            setLoading(null);
        }
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        setLoading(id);
        try {
            await updateFilterOption(id, { isActive: !isActive });
            router.refresh();
        } catch (error) {
            toast.error("Failed to toggle option");
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this option?")) return;
        setLoading(id);
        try {
            await deleteFilterOption(id);
            router.refresh();
            toast.success("Option deleted");
        } catch (error) {
            toast.error("Failed to delete option");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Card className="bg-[#0f172a] border-[#1e293b]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white">{title}</CardTitle>
                        <CardDescription className="text-slate-400">{description}</CardDescription>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => setIsAdding(true)}
                        className="bg-snow-accent text-gray-900 hover:bg-cyan-400"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {isAdding && (
                    <div className="flex items-center gap-2 p-3 bg-[#1e293b] rounded-lg">
                        <Input
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder={type === "duration" ? "e.g. 2 Years" : "e.g. ChatGPT"}
                            className="bg-white/5 border-white/10 text-white"
                            autoFocus
                        />
                        <Button
                            size="icon"
                            onClick={handleAdd}
                            disabled={loading === "add"}
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                            {loading === "add" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => { setIsAdding(false); setNewValue(""); }}
                            className="text-slate-400 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {options.length === 0 && !isAdding ? (
                    <p className="text-slate-500 text-center py-4">No options yet. Click Add to create one.</p>
                ) : (
                    options.map((option) => (
                        <div
                            key={option.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${option.isActive
                                    ? "bg-[#1e293b] border-[#1e293b]"
                                    : "bg-[#1e293b]/50 border-[#1e293b]/50 opacity-60"
                                }`}
                        >
                            <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />

                            {editingId === option.id ? (
                                <>
                                    <Input
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="flex-1 bg-white/5 border-white/10 text-white h-8"
                                        autoFocus
                                    />
                                    <Button
                                        size="icon"
                                        onClick={() => handleUpdate(option.id)}
                                        disabled={loading === option.id}
                                        className="h-8 w-8 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                    >
                                        {loading === option.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditingId(null)}
                                        className="h-8 w-8 text-slate-400 hover:text-white"
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 text-white font-medium">{option.label || option.value}</span>
                                    <Switch
                                        checked={option.isActive}
                                        onCheckedChange={() => handleToggle(option.id, option.isActive)}
                                        disabled={loading === option.id}
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => { setEditingId(option.id); setEditValue(option.value); }}
                                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(option.id)}
                                        disabled={loading === option.id}
                                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                    >
                                        {loading === option.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                    </Button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
