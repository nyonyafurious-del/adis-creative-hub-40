import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaManager } from '@/components/cms/media-manager'
import { BlogManager } from '@/components/cms/blog-manager'
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Mail, 
  Settings, 
  Users,
  Image as ImageIcon,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/seo-head";

interface AdminStats {
  totalProjects: number;
  totalServices: number;
  totalTestimonials: number;
  totalSubmissions: number;
  unreadSubmissions: number;
}

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalProjects: 0,
    totalServices: 0,
    totalTestimonials: 0,
    totalSubmissions: 0,
    unreadSubmissions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and get user role
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) {
          navigate('/auth', { replace: true, state: { from: location } });
          return;
        }
        
        setUser(session.user);
        await fetchUserRole(session.user.id);
        await fetchStats();
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        navigate('/auth', { replace: true, state: { from: location } });
        return;
      }
      
      setUser(session.user);
      await fetchUserRole(session.user.id);
      await fetchStats();
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        return;
      }

      if (data) {
        setUserRole(data.role);
      } else {
        // First time user - assign editor role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([{ user_id: userId, role: 'editor' }]);
        
        if (insertError) {
          console.error('Error creating user role:', insertError);
        } else {
          setUserRole('editor');
        }
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [projectsRes, servicesRes, testimonialsRes, submissionsRes, unreadRes] = await Promise.all([
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('form_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('form_submissions').select('id', { count: 'exact', head: true }).eq('is_read', false)
      ]);

      setStats({
        totalProjects: projectsRes.count || 0,
        totalServices: servicesRes.count || 0,
        totalTestimonials: testimonialsRes.count || 0,
        totalSubmissions: submissionsRes.count || 0,
        unreadSubmissions: unreadRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      navigate('/', { replace: true });
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-youtube-red border-t-transparent"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Portfolio Projects",
      value: stats.totalProjects,
      icon: Briefcase,
      color: "text-blue-500"
    },
    {
      title: "Services",
      value: stats.totalServices,
      icon: Settings,
      color: "text-green-500"
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: MessageSquare,
      color: "text-purple-500"
    },
    {
      title: "Form Submissions",
      value: stats.totalSubmissions,
      icon: Mail,
      color: "text-orange-500",
      badge: stats.unreadSubmissions > 0 ? stats.unreadSubmissions : undefined
    }
  ];

  return (
    <>
      <SEOHead 
        title="Admin Dashboard - Adil GFX"
        description="Content management dashboard for Adil GFX portfolio and services."
        keywords="admin dashboard, content management, portfolio management"
        url="/admin"
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              <LayoutDashboard className="h-6 w-6 text-youtube-red" />
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <Badge variant="secondary" className="capitalize">
                {userRole}
              </Badge>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className="relative">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      {stat.badge && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
                        >
                          {stat.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="submissions">Leads</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Welcome to your admin dashboard! Here you can manage all aspects of your portfolio website.
                      </p>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Last login: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Project
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Service
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-500" />
                      Account Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Role:</span>
                        <Badge variant="outline" className="capitalize">{userRole}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="truncate ml-2">{user?.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Management</CardTitle>
                  <CardDescription>
                    Manage your portfolio projects and showcase your work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold mb-2">Portfolio Management</p>
                      <p className="text-muted-foreground mb-4">
                        Create, edit, and organize your portfolio projects
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Project
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services Management</CardTitle>
                  <CardDescription>
                    Manage your service offerings and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold mb-2">Services Management</p>
                      <p className="text-muted-foreground mb-4">
                        Create and manage your service packages
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Service
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials">
              <Card>
                <CardHeader>
                  <CardTitle>Testimonials Management</CardTitle>
                  <CardDescription>
                    Manage client testimonials and reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold mb-2">Testimonials Management</p>
                      <p className="text-muted-foreground mb-4">
                        Add and showcase client testimonials
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Testimonial
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Form Submissions & Leads
                    {stats.unreadSubmissions > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {stats.unreadSubmissions} new
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    View and manage form submissions from your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg">
                    <div className="text-center">
                      <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-semibold mb-2">Form Submissions</p>
                      <p className="text-muted-foreground mb-4">
                        {stats.totalSubmissions} total submissions
                        {stats.unreadSubmissions > 0 && ` (${stats.unreadSubmissions} unread)`}
                      </p>
                      <Button>
                        <Eye className="h-4 w-4 mr-2" />
                        View All Submissions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaManager />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>
                  Configure your website settings and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg">
                  <div className="text-center">
                    <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-semibold mb-2">Site Settings</p>
                    <p className="text-muted-foreground mb-4">
                      Manage site configuration and integrations
                    </p>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Configure Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}