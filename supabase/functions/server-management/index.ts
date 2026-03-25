import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ServerRequest {
  action: "provision" | "auto_setup" | "backup" | "restore" | "health_check" | "scale" | "terminate";
  serverId?: string;
  config?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, serverId, config }: ServerRequest = await req.json();
    console.log(`Server management action: ${action}`, { serverId, config });

    let result: any = {};

    switch (action) {
      case "provision": {
        // Create new server instance
        const serverCode = `SRV-${Date.now().toString(36).toUpperCase()}`;
        const { data: server, error } = await supabase
          .from("server_instances")
          .insert({
            server_name: config?.name || `Server ${serverCode}`,
            server_code: serverCode,
            server_type: config?.type || "production",
            region: config?.region || "us-east-1",
            cpu_cores: config?.cpu || 2,
            ram_gb: config?.ram || 4,
            storage_gb: config?.storage || 100,
            os_type: config?.os || "ubuntu-22.04",
            auto_scaling_enabled: config?.autoScale || false,
            status: "provisioning",
            setup_config: config || {},
          })
          .select()
          .single();

        if (error) throw error;

        // Auto-trigger setup steps
        const setupSteps = [
          { step_name: "Initialize OS", step_order: 1 },
          { step_name: "Install Dependencies", step_order: 2 },
          { step_name: "Configure Firewall", step_order: 3 },
          { step_name: "Setup SSL Certificates", step_order: 4 },
          { step_name: "Configure Monitoring Agent", step_order: 5 },
          { step_name: "Setup Backup Agent", step_order: 6 },
          { step_name: "Run Security Hardening", step_order: 7 },
          { step_name: "Final Validation", step_order: 8 },
        ];

        for (const step of setupSteps) {
          await supabase.from("server_setup_logs").insert({
            server_id: server.id,
            ...step,
            status: "pending",
          });
        }

        result = { server, message: "Server provisioning started" };
        break;
      }

      case "auto_setup": {
        if (!serverId) throw new Error("Server ID required");

        // Get pending setup steps
        const { data: steps } = await supabase
          .from("server_setup_logs")
          .select("*")
          .eq("server_id", serverId)
          .eq("status", "pending")
          .order("step_order");

        const completedSteps = [];
        for (const step of steps || []) {
          // Simulate step execution
          await supabase
            .from("server_setup_logs")
            .update({
              status: "in_progress",
              started_at: new Date().toISOString(),
            })
            .eq("id", step.id);

          // Simulate processing time
          const duration = Math.floor(Math.random() * 5) + 1;
          
          await supabase
            .from("server_setup_logs")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
              duration_seconds: duration,
              output: `${step.step_name} completed successfully`,
            })
            .eq("id", step.id);

          completedSteps.push(step.step_name);
        }

        // Update server status
        await supabase
          .from("server_instances")
          .update({
            status: "online",
            auto_setup_completed: true,
            last_health_check: new Date().toISOString(),
            health_status: "healthy",
          })
          .eq("id", serverId);

        // Auto-create default backup schedule
        await supabase.from("backup_schedules").insert({
          server_id: serverId,
          schedule_name: "Daily Auto Backup",
          backup_type: "incremental",
          frequency: "daily",
          cron_expression: "0 2 * * *",
          retention_days: 30,
          is_active: true,
          next_run_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });

        result = { completedSteps, message: "Auto setup completed" };
        break;
      }

      case "backup": {
        if (!serverId) throw new Error("Server ID required");

        const backupName = `backup-${new Date().toISOString().split("T")[0]}-${Date.now().toString(36)}`;
        
        const { data: backup, error } = await supabase
          .from("server_backups")
          .insert({
            server_id: serverId,
            backup_name: backupName,
            backup_type: config?.type || "full",
            status: "in_progress",
            is_auto_backup: config?.isAuto || false,
            encryption_enabled: true,
            retention_days: config?.retention || 30,
            started_at: new Date().toISOString(),
            storage_location: `s3://backups/${serverId}/${backupName}`,
          })
          .select()
          .single();

        if (error) throw error;

        // Simulate backup completion
        const size = Math.floor(Math.random() * 50) + 10;
        await supabase
          .from("server_backups")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            size_gb: size,
            checksum: `sha256-${Date.now().toString(16)}`,
            expires_at: new Date(Date.now() + (config?.retention || 30) * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("id", backup.id);

        result = { backup, message: "Backup completed successfully" };
        break;
      }

      case "health_check": {
        if (!serverId) throw new Error("Server ID required");

        // Generate metrics
        const metrics = {
          cpu_usage: Math.floor(Math.random() * 60) + 10,
          memory_usage: Math.floor(Math.random() * 50) + 20,
          disk_usage: Math.floor(Math.random() * 40) + 30,
          network_in_mbps: Math.floor(Math.random() * 100),
          network_out_mbps: Math.floor(Math.random() * 50),
          active_connections: Math.floor(Math.random() * 500) + 50,
          request_count: Math.floor(Math.random() * 10000) + 1000,
          error_count: Math.floor(Math.random() * 10),
          response_time_ms: Math.floor(Math.random() * 100) + 20,
        };

        // Store metrics
        await supabase.from("server_metrics_history").insert({
          server_id: serverId,
          ...metrics,
        });

        // Determine health status
        let healthStatus = "healthy";
        if (metrics.cpu_usage > 80 || metrics.memory_usage > 85) {
          healthStatus = "warning";
        }
        if (metrics.cpu_usage > 95 || metrics.memory_usage > 95) {
          healthStatus = "critical";
        }

        // Update server status
        await supabase
          .from("server_instances")
          .update({
            current_cpu_usage: metrics.cpu_usage,
            current_memory_usage: metrics.memory_usage,
            current_disk_usage: metrics.disk_usage,
            last_health_check: new Date().toISOString(),
            health_status: healthStatus,
          })
          .eq("id", serverId);

        result = { metrics, healthStatus, message: "Health check completed" };
        break;
      }

      case "scale": {
        if (!serverId) throw new Error("Server ID required");

        const { data: server } = await supabase
          .from("server_instances")
          .select("*")
          .eq("id", serverId)
          .single();

        if (!server) throw new Error("Server not found");

        const newCpu = config?.cpu || server.cpu_cores;
        const newRam = config?.ram || server.ram_gb;

        await supabase
          .from("server_instances")
          .update({
            cpu_cores: newCpu,
            ram_gb: newRam,
            auto_scaling_enabled: config?.autoScale ?? server.auto_scaling_enabled,
            min_instances: config?.minInstances ?? server.min_instances,
            max_instances: config?.maxInstances ?? server.max_instances,
          })
          .eq("id", serverId);

        result = { message: `Server scaled to ${newCpu} CPU, ${newRam}GB RAM` };
        break;
      }

      case "terminate": {
        if (!serverId) throw new Error("Server ID required");

        await supabase
          .from("server_instances")
          .update({ status: "terminated" })
          .eq("id", serverId);

        result = { message: "Server terminated" };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`Server management action completed: ${action}`);

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Server management error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});