import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  /* -------------------------
     ROLE FROM STORAGE
  -------------------------- */
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  /* -------------------------
     SCROLL BEHAVIOR
  -------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 12);

      if (current < 10) setIsVisible(true);
      else if (current > lastScrollY) setIsVisible(false);
      else setIsVisible(true);

      setLastScrollY(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* -------------------------
     ACTIONS
  -------------------------- */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      const role = localStorage.getItem("role");

      if (role === "user") {
        await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/logout`,
          { method: "POST", credentials: "include" }
        );
      } else if (role === "ngo") {
        await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/ngo/logout`,
          { method: "POST", credentials: "include" }
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("role");
      setRole(null);
      navigate("/");
    }
  };

  /* -------------------------
     NAV ITEMS
  -------------------------- */
  const navItems =
    role === "user"
      ? [
          { label: "Home", path: "/" },
          { label: "Dashboard", path: "/dashboard" },
          { label: "Donation", path: "/donate" },
          { label: "Raise Issue", path: "/raise-issue" },
          { label: "Simulator", path: "/simulator" },
        ]
      : role === "ngo"
      ? [
          { label: "Home", path: "/" },
          { label: "Dashboard", path: "/dashboard" },
          { label: "Report Submission", path: "/ngo/report" },
          { label: "Simulator", path: "/simulator" },
        ]
      : [];

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
      style={{
        background: "var(--background)",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 6px 18px -10px oklch(0.2 0.02 260 / 0.18)"
          : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              CrisisLens
            </span>
          </Link>

          {/* NAV LINKS (LOGGED IN) */}
          {role && (
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="
                    relative text-sm font-medium
                    text-foreground/70
                    hover:text-[var(--accent-green)]
                    transition-colors
                    group
                  "
                >
                  {item.label}
                  <span
                    className="
                      absolute left-0 -bottom-1
                      h-[2px] w-0
                      bg-[var(--accent-green)]
                      transition-all duration-300
                      group-hover:w-full
                    "
                  />
                </Link>
              ))}
            </nav>
          )}

          {/* AUTH BUTTONS (NOT LOGGED IN) */}
          {!role && (
            <div className="flex items-center gap-4">
              <Link
                to="/signup/ngo"
                className="
                  relative text-sm font-semibold
                  text-foreground/70
                  hover:text-[var(--accent-green)]
                  group
                "
              >
                NGO Login
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[var(--accent-green)] transition-all group-hover:w-full" />
              </Link>

              <Link
                to="/signup/user"
                className="
                  px-4 py-2 rounded-full
                  bg-[var(--accent-green)]
                  text-[var(--primary-foreground)]
                  text-sm font-semibold
                  hover:opacity-90
                  transition
                "
              >
                User Login
              </Link>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 dark:hidden" />
              <Moon className="h-5 w-5 hidden dark:block" />
            </Button>

            {role && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="rounded-full hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
