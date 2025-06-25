import { Button } from "@/components/ui/button";
import { Search, Moon, Plus, FileText, Home, Edit } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold text-slate-900">BlogCraft</h1>
            </Link>
            <div className="hidden md:flex space-x-6 ml-8">
              <Link href="/">
                <Button
                  variant="ghost"
                  className={`flex items-center space-x-2 ${
                    isActive("/")
                      ? "text-primary border-b-2 border-primary font-medium"
                      : "text-slate-600 hover:text-primary"
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
                      : "text-slate-600 hover:text-primary"
                  }`}
                >
                  <Edit className="w-4 h-4" />
                  <span>Create Post</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-primary">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-primary">
              <Moon className="w-5 h-5" />
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
