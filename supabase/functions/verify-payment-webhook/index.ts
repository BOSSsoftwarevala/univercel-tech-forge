
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};


      return new Response(JSON.stringify({ error: "Invalid webhook signature" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {

  }
});
