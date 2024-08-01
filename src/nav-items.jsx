import { TrendingUp, Star } from "lucide-react";
import Index from "./pages/Index.jsx";
import AssetDetails from "./pages/AssetDetails.jsx";
import Favorites from "./pages/Favorites.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Favorites",
    to: "/favorites",
    icon: <Star className="h-4 w-4" />,
    page: <Favorites />,
  },
  {
    title: "Asset Details",
    to: "/asset/:id",
    page: <AssetDetails />,
    hidden: true,
  },
];
