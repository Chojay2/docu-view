"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Database,
  FolderKanban,
  BookOpen,
  Home,
  User,
  LogOut,
  Upload,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export function TopNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  return (
    <nav className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Database className="w-6 h-6 text-[var(--color-brand-primary)]" />
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              Zhiten
            </span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-surface-soft)] hover:text-[var(--color-text-primary)] focus:bg-[var(--color-bg-surface-soft)] focus:text-[var(--color-text-primary)] focus:outline-none"
                    )}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-[var(--color-bg-surface-soft)] text-[var(--color-text-primary)]">
                  <Database className="w-4 h-4 mr-2" />
                  Datasets
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[var(--color-brand-primary)] to-[var(--color-brand-primary)]/80 p-6 no-underline outline-none focus:shadow-md"
                          href="/datasets"
                        >
                          <Database className="h-6 w-6 text-white" />
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Browse Datasets
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Explore all available datasets in our portal
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/datasets?category=Environment"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-bg-surface-soft)] focus:bg-[var(--color-bg-surface-soft)]"
                        >
                          <div className="text-sm font-medium leading-none text-[var(--color-text-primary)]">
                            Environment
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-muted)]">
                            Environmental and climate datasets
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/datasets?category=Health"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-bg-surface-soft)] focus:bg-[var(--color-bg-surface-soft)]"
                        >
                          <div className="text-sm font-medium leading-none text-[var(--color-text-primary)]">
                            Health
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-muted)]">
                            Health and medical research data
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/datasets?category=Economy"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--color-bg-surface-soft)] focus:bg-[var(--color-bg-surface-soft)]"
                        >
                          <div className="text-sm font-medium leading-none text-[var(--color-text-primary)]">
                            Economy
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-[var(--color-text-muted)]">
                            Economic and financial datasets
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/projects" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-surface-soft)] hover:text-[var(--color-text-primary)] focus:bg-[var(--color-bg-surface-soft)] focus:text-[var(--color-text-primary)] focus:outline-none"
                    )}
                  >
                    <FolderKanban className="w-4 h-4 mr-2" />
                    Projects
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/docs" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-bg-surface-soft)] hover:text-[var(--color-text-primary)] focus:bg-[var(--color-bg-surface-soft)] focus:text-[var(--color-text-primary)] focus:outline-none"
                    )}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/datasets/upload">
                  <Button variant="outline" size="sm" className="text-[14px]">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Dataset
                  </Button>
                </Link>
                <Link href="/projects/create">
                  <Button variant="outline" size="sm" className="text-[14px]">
                    <FolderKanban className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-[14px]">
                      <User className="w-4 h-4 mr-2" />
                      {user?.name || user?.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-[14px]">
                      <div className="font-medium text-[var(--color-text-primary)]">
                        {user?.name || "User"}
                      </div>
                      <div className="text-[12px] text-[var(--color-text-muted)]">
                        {user?.email}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {user?.role === "ADMIN" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/dashboard"
                            className="cursor-pointer"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/users/profile" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-[14px]">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="text-[14px] bg-[var(--color-brand-primary)] text-[var(--color-text-on-brand)]"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
