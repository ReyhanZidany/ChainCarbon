import db from "../config/db.js";

export const getDashboardData = (req, res) => {
  const queries = {
    projects:
      "SELECT COUNT(*) AS active_projects FROM projects WHERE status = 'Aktif'",
    sold: "SELECT COALESCE(SUM(amount),0) AS total_carbon_sold FROM transactions WHERE type = 'sell'",
    bought:
      "SELECT COALESCE(SUM(amount),0) AS total_carbon_bought FROM transactions WHERE type = 'buy'",
    value:
      "SELECT COALESCE(SUM(amount * price),0) AS carbon_value FROM transactions",
    activities: "SELECT * FROM activities ORDER BY date DESC LIMIT 5",
    projectsOverview: "SELECT * FROM projects LIMIT 5",
    schedules: "SELECT * FROM schedules ORDER BY date ASC LIMIT 5",
  };

  db.query(queries.projects, (err, projResult) => {
    if (err) return res.status(500).json({ message: err.message });

    db.query(queries.sold, (err, soldResult) => {
      if (err) return res.status(500).json({ message: err.message });

      db.query(queries.bought, (err, boughtResult) => {
        if (err) return res.status(500).json({ message: err.message });

        db.query(queries.value, (err, valueResult) => {
          if (err) return res.status(500).json({ message: err.message });

          db.query(queries.activities, (err, activitiesResult) => {
            if (err) return res.status(500).json({ message: err.message });

            db.query(queries.projectsOverview, (err, projectsResult) => {
              if (err) return res.status(500).json({ message: err.message });

              db.query(queries.schedules, (err, schedulesResult) => {
                if (err) return res.status(500).json({ message: err.message });

                return res.json({
                  company: {
                    company_name: "PT LEDGRON", // bisa ambil dari user login nanti
                    active_projects: projResult[0].active_projects,
                    total_carbon_sold: soldResult[0].total_carbon_sold,
                    total_carbon_bought: boughtResult[0].total_carbon_bought,
                    carbon_value: valueResult[0].carbon_value,
                  },
                  recentActivities: activitiesResult,
                  projectOverview: projectsResult,
                  upcomingSchedule: schedulesResult,
                });
              });
            });
          });
        });
      });
    });
  });
};
