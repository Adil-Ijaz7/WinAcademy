import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { applicationId } = body;

    // Validate applicationId format
    if (!applicationId || typeof applicationId !== "string" || !UUID_REGEX.test(applicationId)) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use service role to verify the application exists in the database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: application, error: dbError } = await supabaseAdmin
      .from("admission_applications")
      .select("full_name, email, course_interest")
      .eq("id", applicationId)
      .maybeSingle();

    if (dbError || !application) {
      console.error("Application not found or DB error:", dbError);
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Use verified data from database, not from client input
    const { full_name: fullName, email, course_interest: courseInterest } = application;

    console.log("Sending admission confirmation email to:", email);

    // Send confirmation to applicant
    const emailResponse = await resend.emails.send({
      from: "Win Academy <onboarding@resend.dev>",
      to: [email],
      subject: "Application Received - Win Academy",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Win Academy</h1>
              <p>Empowering Minds, Building Futures</p>
            </div>
            <div class="content">
              <h2>Dear ${fullName},</h2>
              <p>Thank you for submitting your application to <strong>Win Academy</strong>!</p>
              <div class="highlight">
                <strong>Application Details:</strong><br>
                📋 Application ID: <code>${applicationId}</code><br>
                📚 Course Interest: <strong>${courseInterest}</strong><br>
                📅 Submitted: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our admissions team will review your application within 2-3 business days</li>
                <li>You'll receive an update via email regarding your application status</li>
              </ul>
              <p>Best regards,<br><strong>The Win Academy Admissions Team</strong></p>
            </div>
            <div class="footer">
              <p>Win Academy | Daro Road, Dadu, Sindh, Pakistan</p>
              <p>© ${new Date().getFullYear()} Win Academy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send notification to admin
    const adminNotification = await resend.emails.send({
      from: "Win Academy <onboarding@resend.dev>",
      to: ["winacademydadu@gmail.com"],
      subject: `New Admission Application - ${fullName}`,
      html: `
        <h2>New Admission Application Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Course Interest:</strong> ${courseInterest}</p>
        <p><strong>Application ID:</strong> ${applicationId}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      `,
    });

    console.log("Admin notification sent:", adminNotification);

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admission-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send confirmation email. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
