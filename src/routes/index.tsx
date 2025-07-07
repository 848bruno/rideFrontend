import { createFileRoute } from '@tanstack/react-router'



import { useState, useEffect, useContext } from 'react'
import {
  MapPin,
  Car,
  Users,
  Star,
  Shield,
  Clock,
  Package,
  DollarSign,
  Zap,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  Globe,
  Award,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useNavigate } from '@tanstack/react-router'
import { AuthDialog } from '@/components/auth-dialog'
import { AuthContext } from '@/contexts/AuthContext'
import { authService } from '@/lib/auth-service'

export const Route = createFileRoute('/')({
  component: Home,
})

export default function Home() {
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authDialogTab, setAuthDialogTab] = useState<'signin' | 'signup'>(
    'signin',
  )
  const [authDialogRole, setAuthDialogRole] = useState<
    'customer' | 'driver' | 'admin'
  >('')

  useEffect(() => {
    const shouldRedirect = sessionStorage.getItem('justLoggedIn')

    if (shouldRedirect && authContext?.isAuthenticated && authContext.user) {
      sessionStorage.removeItem('justLoggedIn')
      const redirectPath = authService.getRedirectPath(authContext.user.role)
      navigate({ to: redirectPath, replace: true })
    }
  }, [authContext?.isAuthenticated, authContext?.user, navigate])

  const openAuthDialog = (
    tab: 'signin' | 'signup',
    role: 'customer' | 'driver' | 'admin' = '',
  ) => {
    setAuthDialogTab(tab)
    setAuthDialogRole(role)
    setAuthDialogOpen(true)
  }

  const services = [
    {
      title: 'Ride Booking',
      description: 'Book instant rides with professional drivers in your area',
      icon: Car,
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Real-time GPS tracking',
        'Multiple vehicle options',
        'Secure payment methods',
        '24/7 availability',
      ],
    },
    {
      title: 'Ride Sharing',
      description: 'Share rides and save money while meeting new people',
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      features: [
        'Save up to 60% on rides',
        'Eco-friendly travel',
        'Meet verified riders',
        'Flexible scheduling',
      ],
    },
    {
      title: 'Package Delivery',
      description: 'Fast and reliable delivery service for your packages',
      icon: Package,
      gradient: 'from-purple-500 to-purple-600',
      features: [
        'Same-day delivery',
        'Package tracking',
        'Secure handling',
        'Proof of delivery',
      ],
    },
    {
      title: 'Driver Platform',
      description: 'Earn money driving with flexible schedules',
      icon: DollarSign,
      gradient: 'from-orange-500 to-orange-600',
      features: [
        'Competitive earnings',
        'Flexible hours',
        'Driver support',
        'Performance bonuses',
      ],
    },
  ]

  const stats = [
    {
      label: 'Active Users',
      value: '50K+',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Completed Rides',
      value: '1M+',
      icon: Car,
      color: 'text-green-600',
    },
    {
      label: 'Cities Covered',
      value: '25+',
      icon: Globe,
      color: 'text-purple-600',
    },
    {
      label: 'Average Rating',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-600',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Customer',
      content:
        'RideFlow has revolutionized my daily commute. The drivers are professional and the app is super easy to use.',
      avatar: 'SJ',
      rating: 5,
    },
    {
      name: 'Mike Rodriguez',
      role: 'Driver Partner',
      content:
        'I love the flexibility RideFlow offers. I can work whenever I want and the earnings are great!',
      avatar: 'MR',
      rating: 5,
    },
    {
      name: 'Emma Chen',
      role: 'Business Owner',
      content:
        'The delivery service has been a game-changer for our business. Fast, reliable, and professional.',
      avatar: 'EC',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Hero Section */}
 <section className="relative overflow-hidden h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40">
          <img 
            src="/public/highway.jpg" 
            alt="Luxury transportation" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit mx-auto backdrop-blur-sm">
                <Zap className="w-3 h-3 mr-1" />
                Now Available in 25+ Cities
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
                Premium <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">Luxury</span> Transportation
              </h1>

              <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                Experience unparalleled comfort with our professional chauffeurs and luxury fleet.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto backdrop-blur-sm bg-white/10 rounded-xl p-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center text-white">
                    <div className="flex justify-center mb-2">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/80">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => openAuthDialog("signup", "customer")}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                <ArrowRight className="w-5 h-5" />
                Book Your Ride
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate({ to: "/app" })}
                className="flex items-center gap-2 border-2 border-white/20 hover:border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                <PlayCircle className="w-5 h-5" />
                Virtual Tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              Our Services
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Complete Transportation Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From personal rides to business logistics, we've got you covered
              with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-600/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <PlayCircle className="w-3 h-3 mr-1" />
              Interactive Demo
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Experience RideFlow in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Try our full-featured demo with realistic data. No registration
              required - explore all dashboards and features instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Customer Experience
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Book rides, track drivers, manage deliveries, and explore
                    payment options.
                  </p>
                  <Button
                    onClick={() => navigate({ to: '/app' })}
                    className="w-full"
                    variant="outline"
                  >
                    Try Customer Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Driver Dashboard
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Manage rides, track earnings, view analytics, and handle
                    vehicle information.
                  </p>
                  <Button
                    onClick={() => navigate({ to: '/driver-dashboard' })}
                    className="w-full"
                    variant="outline"
                  >
                    Try Driver Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Admin Control</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Business analytics, user management, fleet oversight, and
                    platform insights.
                  </p>
                  <Button
                    onClick={() => navigate({ to: '/admin-dashboard' })}
                    className="w-full"
                    variant="outline"
                  >
                    Try Admin Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">
                All demo features unlocked
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm font-medium">Real-time simulation</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-sm font-medium">No signup required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers, drivers, and businesses who
              trust RideFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-600/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Transportation?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join RideFlow today and experience the future of mobility. Start
            with our interactive demo or create your account to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/app' })}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Demo Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => openAuthDialog('signup')}
              className="border-2 border-primary/20 hover:border-primary/40"
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Demo includes full access to all features
            </span>
          </div>
        </div>
      </section>

      {/* Authentication Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultTab={authDialogTab}
        defaultRole={authDialogRole}
      />
    </div>
  )
}

