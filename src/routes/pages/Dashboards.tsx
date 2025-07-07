import {
  Car,
  Users,
  BarChart,
  MapPin,
  ArrowRight,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Dashboards() {
  const navigate = useNavigate();

  const dashboards = [
    {
      title: "Driver Dashboard",
      description: "Manage rides, track earnings, and view trip history",
      icon: Car,
      route: "/driver-dashboard",
      color: "bg-primary",
      features: [
        "Real-time ride requests",
        "Earnings tracking",
        "Trip management",
        "Performance metrics",
      ],
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive business management and analytics",
      icon: BarChart,
      route: "/admin-dashboard",
      color: "bg-accent",
      features: [
        "Fleet management",
        "Driver oversight",
        "Revenue analytics",
        "Customer support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">RideFlow Dashboards</h1>
              <p className="text-muted-foreground">
                Choose your interface to get started
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dashboards.map((dashboard) => {
              const Icon = dashboard.icon;
              return (
                <Card
                  key={dashboard.title}
                  className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(dashboard.route)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className={`w-16 h-16 ${dashboard.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          {dashboard.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {dashboard.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-sm">Key Features:</h4>
                      <ul className="space-y-2">
                        {dashboard.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full group-hover:translate-x-1 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(dashboard.route);
                      }}
                    >
                      Access Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>

                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icon className="w-24 h-24" />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold">89</h3>
                <p className="text-sm text-muted-foreground">Active Drivers</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">1,847</h3>
                <p className="text-sm text-muted-foreground">Total Trips</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <BarChart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">$45.2K</h3>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">4.7</h3>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Need Help Getting Started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our comprehensive dashboards provide real-time insights and
              management tools for every aspect of your ride-sharing business.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate("/app")}>
                Back to Customer App
              </Button>
              <Button onClick={() => navigate("/admin-dashboard")}>
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
