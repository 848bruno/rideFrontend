import {
  ArrowLeft,
  User,
  Star,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const mockUser = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    trips: 47,
    memberSince: "March 2023",
    image: "/placeholder.svg",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/app")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-semibold">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={mockUser.image} />
                <AvatarFallback>
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{mockUser.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {mockUser.email}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {mockUser.rating}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {mockUser.trips} trips
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Member since {mockUser.memberSince}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">47</div>
              <div className="text-xs text-muted-foreground">Total Trips</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">$284</div>
              <div className="text-xs text-muted-foreground">Saved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">4.8</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Payment Methods</div>
                    <div className="text-sm text-muted-foreground">
                      Manage cards and wallets
                    </div>
                  </div>
                </button>
                <Separator />
                <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Saved Places</div>
                    <div className="text-sm text-muted-foreground">
                      Home, work, and favorites
                    </div>
                  </div>
                </button>
                <Separator />
                <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Safety</div>
                    <div className="text-sm text-muted-foreground">
                      Emergency contacts and settings
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Settings</div>
                    <div className="text-sm text-muted-foreground">
                      Notifications and preferences
                    </div>
                  </div>
                </button>
                <Separator />
                <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">Help & Support</div>
                    <div className="text-sm text-muted-foreground">
                      FAQ and contact support
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Button
                variant="outline"
                className="w-full text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
