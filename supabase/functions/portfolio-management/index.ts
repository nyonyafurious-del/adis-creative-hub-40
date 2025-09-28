import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PortfolioProject {
  id?: string;
  title: string;
  description?: string;
  short_description?: string;
  images?: string[];
  categories?: string[];
  tags?: string[];
  project_url?: string;
  featured_image?: string;
  sort_order?: number;
  is_featured?: boolean;
  status: 'draft' | 'published' | 'archived';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const method = req.method;
    const pathSegments = url.pathname.split('/');
    const projectId = pathSegments[pathSegments.length - 1];

    // Get user from authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check user role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'editor')) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (method) {
      case 'GET':
        // Get all projects or single project
        if (projectId && projectId !== 'portfolio-management') {
          const { data, error } = await supabaseClient
            .from('portfolio_projects')
            .select('*')
            .eq('id', projectId)
            .single();

          if (error) {
            return new Response(
              JSON.stringify({ error: 'Project not found' }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          const { data, error } = await supabaseClient
            .from('portfolio_projects')
            .select('*')
            .order('sort_order', { ascending: true });

          if (error) {
            return new Response(
              JSON.stringify({ error: 'Failed to fetch projects' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

      case 'POST':
        // Create new project
        const newProjectData: PortfolioProject = await req.json();
        
        if (!newProjectData.title) {
          return new Response(
            JSON.stringify({ error: 'Title is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: newProject, error: createError } = await supabaseClient
          .from('portfolio_projects')
          .insert([{
            ...newProjectData,
            created_by: user.id,
            updated_by: user.id
          }])
          .select()
          .single();

        if (createError) {
          return new Response(
            JSON.stringify({ error: 'Failed to create project' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(newProject),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'PUT':
        // Update existing project
        if (!projectId || projectId === 'portfolio-management') {
          return new Response(
            JSON.stringify({ error: 'Project ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData: Partial<PortfolioProject> = await req.json();
        
        const { data: updatedProject, error: updateError } = await supabaseClient
          .from('portfolio_projects')
          .update({
            ...updateData,
            updated_by: user.id
          })
          .eq('id', projectId)
          .select()
          .single();

        if (updateError) {
          return new Response(
            JSON.stringify({ error: 'Failed to update project' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(updatedProject),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'DELETE':
        // Delete project
        if (!projectId || projectId === 'portfolio-management') {
          return new Response(
            JSON.stringify({ error: 'Project ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Only admins can delete
        if (roleData.role !== 'admin') {
          return new Response(
            JSON.stringify({ error: 'Admin privileges required for deletion' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await supabaseClient
          .from('portfolio_projects')
          .delete()
          .eq('id', projectId);

        if (deleteError) {
          return new Response(
            JSON.stringify({ error: 'Failed to delete project' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Project deleted successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in portfolio-management function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});