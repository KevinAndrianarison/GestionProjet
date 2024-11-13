import React, { useEffect } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartGantt } from "@fortawesome/free-solid-svg-icons";

export default function GanttChart() {
  useEffect(() => {
    gantt.config.date_format = "%Y-%m-%d";
    gantt.config.scale_unit = "day";
    gantt.config.date_scale = "%d %M";
    gantt.config.columns = [
      { name: "text", label: "Tâche", width: "*", tree: true },
      { name: "start_date", label: "Début", align: "center", width: 90 },
      { name: "duration", label: "Durée", align: "center", width: 90 },
      { name: "add", label: "", width: 44 },
    ];
    const tasks = {
      data: [
        {
          id: 1,
          text: "Tâche 1",
          start_date: "2024-11-01",
          duration: 5,
          progress: 0.4,
        },
        {
          id: 2,
          text: "Tâche 2",
          start_date: "2024-11-06",
          duration: 4,
          progress: 0.6,
          parent: 1,
        },
        {
          id: 3,
          text: "Tâche 3",
          start_date: "2024-11-10",
          duration: 3,
          progress: 0.8,
          parent: 1,
        },
      ],
    };

    gantt.init("gantt_here");
    gantt.parse(tasks);
  }, []);

  return (
    <div cl style={{ padding: "20px" }}>
      <h2 className="font-bold"><FontAwesomeIcon icon={faChartGantt} className="mr-2 text-gray-500" /> Diagramme de Gantt</h2>
      <div  className="mt-10" id="gantt_here" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}
