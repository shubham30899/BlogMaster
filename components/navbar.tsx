import { Button } from "@/components/ui/button";
import { Search, Moon, Sun, Plus, FileText, Home, Edit } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">BlogCraft</h1>
            </Link>
            <div className="hidden md:flex space-x-6 ml-8">
              <Link href="/">
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 ${
                    isActive("/")
                      ? "text-primary border-b-2 border-primary font-medium"
                      : "text-slate-600 dark:text-slate-300 hover:text-primary"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <Link href="/create">
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 ${
                    isActive("/create")
                      ? "text-primary border-b-2 border-primary font-medium"
                      : "text-slate-600 dark:text-slate-300 hover:text-primary"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  <span>Create Post</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {searchOpen ? (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search posts..."
                  className="w-64"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-600 dark:text-slate-300 hover:text-primary"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-600 dark:text-slate-300 hover:text-primary"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Link href="/create">
              <Button className="bg-primary text-white hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
