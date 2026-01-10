"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { User, Settings, ShoppingBag, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserDropdownProps {
    user: {
        id: string;
        email?: string | null;
        given_name?: string | null;
        family_name?: string | null;
        picture?: string | null;
    };
    role?: string | null;
}

export function UserDropdown({ user, role }: UserDropdownProps) {
    const displayName = user.given_name && user.family_name
        ? `${user.given_name} ${user.family_name}`
        : user.given_name || user.email?.split('@')[0] || 'User';

    const isAdmin = role === 'ADMIN';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 pr-3 bg-white/5 rounded-full hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 group outline-none">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-snow-accent transition-colors shrink-0">
                    {user.picture ? (
                        <Image
                            src={user.picture}
                            alt={displayName}
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-snow-accent/30 to-snow-accent/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    )}
                </div>
                <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-56 bg-snow-primary/95 backdrop-blur-xl border-white/10 text-white shadow-2xl"
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-white">{displayName}</p>
                        {user.email && (
                            <p className="text-xs text-white/50 truncate">{user.email}</p>
                        )}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuGroup>
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin" className="flex items-center gap-3 cursor-pointer hover:bg-white/10">
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center gap-3 cursor-pointer hover:bg-white/10">
                            <User className="w-4 h-4" />
                            <span>Account</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/orders" className="flex items-center gap-3 cursor-pointer hover:bg-white/10">
                            <ShoppingBag className="w-4 h-4" />
                            <span>My Orders</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href="/account/settings" className="flex items-center gap-3 cursor-pointer hover:bg-white/10">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem asChild>
                    <LogoutLink className="flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
