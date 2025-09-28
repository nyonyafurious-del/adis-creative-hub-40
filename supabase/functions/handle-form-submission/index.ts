import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormSubmissionData {
  form_type: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  service_interest?: string;
  budget_range?: string;
  timeline?: string;
  source?: string;
  metadata?: any;
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

    const formData: FormSubmissionData = await req.json();

    // Validation
    if (!formData.form_type) {
      return new Response(
        JSON.stringify({ error: 'Form type is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Additional validation based on form type
    if (formData.form_type === 'contact' && (!formData.name || !formData.email)) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required for contact forms' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert form submission
    const { data, error } = await supabaseClient
      .from('form_submissions')
      .insert([{
        form_type: formData.form_type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        service_interest: formData.service_interest,
        budget_range: formData.budget_range,
        timeline: formData.timeline,
        source: formData.source || 'website',
        metadata: formData.metadata || {},
        is_read: false,
        is_archived: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save form submission' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Form submission saved successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        message: 'Form submitted successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in handle-form-submission function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});