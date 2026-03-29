// R&D Department API for Software Vala
import {
  withEnhancedMiddleware,
  applyMasking,
  notificationMiddleware,
} from "../_shared/enhanced-middleware.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
} from "../_shared/utils.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-rnd", "");
  const method = req.method;

  // POST /rnd/idea
  if (method === "POST" && path === "/idea") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["title", "description", "category"]);
      if (validation) return errorResponse(validation);

      // AI-simulated scoring (would use actual ML model)
      const innovationScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const feasibilityScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const marketScore = Math.floor(Math.random() * 35) + 65; // 65-100
      const overallScore = Math.floor((innovationScore + feasibilityScore + marketScore) / 3);

      const { data: idea, error } = await ctx.supabaseAdmin
        .from("rnd_ideas")
        .insert({
          title: ctx.body.title,
          description: ctx.body.description,
          category: ctx.body.category, // product, feature, improvement, research
          proposed_by: ctx.user!.userId,
          proposed_by_role: ctx.user!.role,
          status: "submitted",
          priority: ctx.body.priority || "medium",
          estimated_effort: ctx.body.estimated_effort, // days
          estimated_impact: ctx.body.estimated_impact, // high, medium, low
          target_release: ctx.body.target_release,
          tags: ctx.body.tags || [],
          ai_scores: {
            innovation: innovationScore,
            feasibility: feasibilityScore,
            market_potential: marketScore,
            overall: overallScore,
          },
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to submit idea.");

      await notificationMiddleware(ctx, "rnd.new_idea", {
        idea_id: idea.id,
        title: ctx.body.title,
        score: overallScore,
        target_role: "rd_department",
      });

      return jsonResponse({
        message: "Your idea has been submitted for review.",
        idea,
        ai_evaluation: {
          innovation_score: innovationScore,
          feasibility_score: feasibilityScore,
          market_score: marketScore,
          overall_score: overallScore,
          recommendation: overallScore >= 80 ? "High Priority" : overallScore >= 65 ? "Worth Exploring" : "Needs Refinement",
        },
      }, 201);
    }, {
      module: "rnd",
      action: "submit_idea",
      requireAuth: true,
    });
  }

  // GET /rnd/list
  if (method === "GET" && path === "/list") {
    return withEnhancedMiddleware(req, async (ctx) => {
      let query = ctx.supabaseAdmin.from("rnd_ideas").select(`
        *,
        rnd_idea_comments(count),
        rnd_idea_votes(count)
      `);

      // Apply filters
      const status = url.searchParams.get("status");
      if (status) query = query.eq("status", status);

      const category = url.searchParams.get("category");
      if (category) query = query.eq("category", category);

      const priority = url.searchParams.get("priority");
      if (priority) query = query.eq("priority", priority);

      // Sort by AI score by default
      const sortBy = url.searchParams.get("sort") || "ai_score";
      if (sortBy === "ai_score") {
        query = query.order("ai_scores->overall", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data: ideas, error } = await query;
      if (error) return errorResponse("Unable to retrieve ideas.");

      // Summary stats
      interface IdeaRecord {
        status: string;
        ai_scores?: { overall?: number };
      }
      const summary = {
        total: ideas?.length || 0,
        by_status: {
          submitted: ideas?.filter((i: IdeaRecord) => i.status === "submitted").length || 0,
          under_review: ideas?.filter((i: IdeaRecord) => i.status === "under_review").length || 0,
          approved: ideas?.filter((i: IdeaRecord) => i.status === "approved").length || 0,
          in_development: ideas?.filter((i: IdeaRecord) => i.status === "in_development").length || 0,
          completed: ideas?.filter((i: IdeaRecord) => i.status === "completed").length || 0,
          rejected: ideas?.filter((i: IdeaRecord) => i.status === "rejected").length || 0,
        },
        avg_score: ideas?.length 
          ? Math.floor(ideas.reduce((sum: number, i: IdeaRecord) => sum + (i.ai_scores?.overall || 0), 0) / ideas.length)
          : 0,
      };

      return jsonResponse({
        ideas: applyMasking(ideas, ctx.user!.role),
        summary,
      });
    }, {
      module: "rnd",
      action: "list_ideas",
      allowedRoles: ["super_admin", "admin", "rd_department", "product_manager"],
    });
  }

  // POST /rnd/approve
  if (method === "POST" && path === "/approve") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["idea_id"]);
      if (validation) return errorResponse(validation);

      const { data: idea, error } = await ctx.supabaseAdmin
        .from("rnd_ideas")
        .update({
          status: "approved",
          approved_by: ctx.user!.userId,
          approved_at: new Date().toISOString(),
          approval_notes: ctx.body.notes,
          assigned_to: ctx.body.assigned_to,
          target_release: ctx.body.target_release,
        })
        .eq("id", ctx.body.idea_id)
        .select()
        .single();

      if (error) return errorResponse("Unable to approve idea.");

      // Notify proposer
      await notificationMiddleware(ctx, "rnd.idea_approved", {
        idea_id: idea.id,
        target_user_id: idea.proposed_by,
      });

      return jsonResponse({
        message: "Idea approved and added to the development pipeline.",
        idea,
      });
    }, {
      module: "rnd",
      action: "approve_idea",
      allowedRoles: ["super_admin", "admin", "rd_department"],
    });
  }

  // POST /rnd/reject
  if (method === "POST" && path === "/reject") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["idea_id", "reason"]);
      if (validation) return errorResponse(validation);

      const { data: idea, error } = await ctx.supabaseAdmin
        .from("rnd_ideas")
        .update({
          status: "rejected",
          rejected_by: ctx.user!.userId,
          rejected_at: new Date().toISOString(),
          rejection_reason: ctx.body.reason,
        })
        .eq("id", ctx.body.idea_id)
        .select()
        .single();

      if (error) return errorResponse("Unable to reject idea.");

      // Notify proposer with constructive feedback
      await notificationMiddleware(ctx, "rnd.idea_rejected", {
        idea_id: idea.id,
        reason: ctx.body.reason,
        target_user_id: idea.proposed_by,
      });

      return jsonResponse({
        message: "Idea has been rejected with feedback.",
        idea,
      });
    }, {
      module: "rnd",
      action: "reject_idea",
      allowedRoles: ["super_admin", "admin", "rd_department"],
    });
  }

  // POST /rnd/vote
  if (method === "POST" && path === "/vote") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["idea_id", "vote_type"]);
      if (validation) return errorResponse(validation);

      if (!["upvote", "downvote"].includes(ctx.body.vote_type)) {
        return errorResponse("Vote type must be upvote or downvote");
      }

      // Check existing vote
      const { data: existingVote } = await ctx.supabaseAdmin
        .from("rnd_idea_votes")
        .select("id, vote_type")
        .eq("idea_id", ctx.body.idea_id)
        .eq("user_id", ctx.user!.userId)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === ctx.body.vote_type) {
          // Remove vote
          await ctx.supabaseAdmin
            .from("rnd_idea_votes")
            .delete()
            .eq("id", existingVote.id);
          
          return jsonResponse({ message: "Vote removed." });
        } else {
          // Change vote
          await ctx.supabaseAdmin
            .from("rnd_idea_votes")
            .update({ vote_type: ctx.body.vote_type })
            .eq("id", existingVote.id);
          
          return jsonResponse({ message: "Vote updated." });
        }
      }

      // Add new vote
      await ctx.supabaseAdmin.from("rnd_idea_votes").insert({
        idea_id: ctx.body.idea_id,
        user_id: ctx.user!.userId,
        vote_type: ctx.body.vote_type,
      });

      return jsonResponse({ message: "Vote recorded." });
    }, {
      module: "rnd",
      action: "vote_idea",
      requireAuth: true,
    });
  }

  // POST /rnd/comment
  if (method === "POST" && path === "/comment") {
    return withEnhancedMiddleware(req, async (ctx) => {
      const validation = validateRequired(ctx.body, ["idea_id", "comment"]);
      if (validation) return errorResponse(validation);

      const { data: comment, error } = await ctx.supabaseAdmin
        .from("rnd_idea_comments")
        .insert({
          idea_id: ctx.body.idea_id,
          user_id: ctx.user!.userId,
          comment: ctx.body.comment,
          is_internal: ctx.body.is_internal || false,
        })
        .select()
        .single();

      if (error) return errorResponse("Unable to add comment.");

      return jsonResponse({
        message: "Comment added.",
        comment,
      });
    }, {
      module: "rnd",
      action: "comment_idea",
      requireAuth: true,
    });
  }

  // GET /rnd/trends
  if (method === "GET" && path === "/trends") {
    return withEnhancedMiddleware(req, async (ctx) => {
      // Get market trends data (simulated)
      const trends = {
        emerging_technologies: [
          { name: "AI/ML Integration", growth: "+45%", relevance: "high" },
          { name: "Low-Code Platforms", growth: "+38%", relevance: "high" },
          { name: "Edge Computing", growth: "+32%", relevance: "medium" },
          { name: "Blockchain", growth: "+15%", relevance: "low" },
        ],
        competitor_analysis: [
          { competitor: "Competitor A", new_features: 12, market_share: "+2.3%" },
          { competitor: "Competitor B", new_features: 8, market_share: "+1.1%" },
        ],
        customer_requests: {
          total: 256,
          categories: {
            "New Features": 45,
            "Integrations": 32,
            "Performance": 28,
            "UI/UX": 25,
            "Mobile": 20,
          },
        },
        recommendation: "Focus on AI/ML integration and mobile experience improvements based on market trends and customer feedback.",
      };

      return jsonResponse(trends);
    }, {
      module: "rnd",
      action: "view_trends",
      allowedRoles: ["super_admin", "admin", "rd_department", "product_manager"],
    });
  }

  return errorResponse("Endpoint not found", 404);
});
