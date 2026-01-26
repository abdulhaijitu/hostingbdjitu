import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RateLimitRequest {
  identifier: string;
  action: "check" | "record_failure" | "record_success";
  maxAttempts?: number;
  lockoutMinutes?: number;
  windowMinutes?: number;
}

interface RateLimitResponse {
  success: boolean;
  isLocked: boolean;
  attemptsRemaining: number;
  lockedUntil: string | null;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Create service role client for accessing login_attempts table
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: RateLimitRequest = await req.json();
    const { 
      identifier, 
      action, 
      maxAttempts = 5, 
      lockoutMinutes = 15,
      windowMinutes = 15 
    } = body;

    if (!identifier || !action) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Missing required fields: identifier, action" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    let response: RateLimitResponse;

    switch (action) {
      case "check": {
        // Check if the identifier is rate limited
        const { data, error } = await supabase.rpc("check_rate_limit", {
          p_identifier: identifier.toLowerCase(),
          p_max_attempts: maxAttempts,
          p_lockout_minutes: lockoutMinutes,
          p_window_minutes: windowMinutes,
        });

        if (error) {
          console.error("Rate limit check error:", error);
          // On error, allow the attempt (fail open for availability)
          response = {
            success: true,
            isLocked: false,
            attemptsRemaining: maxAttempts,
            lockedUntil: null,
            message: "OK",
          };
        } else {
          const result = data?.[0] || { 
            is_locked: false, 
            attempts_remaining: maxAttempts, 
            locked_until: null, 
            message: "OK" 
          };
          
          response = {
            success: true,
            isLocked: result.is_locked,
            attemptsRemaining: result.attempts_remaining,
            lockedUntil: result.locked_until,
            message: result.message,
          };
        }
        break;
      }

      case "record_failure": {
        // Record a failed login attempt
        const { error } = await supabase.rpc("record_login_attempt", {
          p_identifier: identifier.toLowerCase(),
          p_success: false,
          p_max_attempts: maxAttempts,
          p_lockout_minutes: lockoutMinutes,
        });

        if (error) {
          console.error("Record failure error:", error);
        }

        // Check the new status after recording
        const { data: checkData } = await supabase.rpc("check_rate_limit", {
          p_identifier: identifier.toLowerCase(),
          p_max_attempts: maxAttempts,
          p_lockout_minutes: lockoutMinutes,
          p_window_minutes: windowMinutes,
        });

        const result = checkData?.[0] || { 
          is_locked: false, 
          attempts_remaining: maxAttempts - 1, 
          locked_until: null, 
          message: "Failed attempt recorded" 
        };

        response = {
          success: true,
          isLocked: result.is_locked,
          attemptsRemaining: result.attempts_remaining,
          lockedUntil: result.locked_until,
          message: result.is_locked 
            ? "Account temporarily locked due to too many failed attempts" 
            : `${result.attempts_remaining} attempts remaining`,
        };
        break;
      }

      case "record_success": {
        // Clear failed attempts on successful login
        const { error } = await supabase.rpc("record_login_attempt", {
          p_identifier: identifier.toLowerCase(),
          p_success: true,
          p_max_attempts: maxAttempts,
          p_lockout_minutes: lockoutMinutes,
        });

        if (error) {
          console.error("Record success error:", error);
        }

        response = {
          success: true,
          isLocked: false,
          attemptsRemaining: maxAttempts,
          lockedUntil: null,
          message: "Login successful, attempts reset",
        };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Invalid action. Use: check, record_failure, record_success" 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Rate limit function error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        isLocked: false,
        attemptsRemaining: 5,
        lockedUntil: null,
        message: "Rate limit check failed" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});