import React, { useEffect, useContext } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartGantt } from "@fortawesome/free-solid-svg-icons";
import { TaskContext } from "../contexte/useTask";

export default function GanttChart() {
  const { ListTask, getAllTask } = useContext(TaskContext);

  useEffect(() => {
    getAllTask();
    if (ListTask && ListTask.length > 0) {
      gantt.config.subscales = [{ unit: "year", step: 1, date: "Année %Y" }];
      gantt.config.date_format = "%Y-%m-%d";
      gantt.config.scale_unit = "day";
      gantt.config.date_scale = "%d %M";
      gantt.config.autofit = true;
      gantt.config.columns = [
        { name: "text", label: "Tâche", width: 150, tree: true },
        { name: "start_date", label: "Début", align: "center", width: 150 },
        { name: "duration", label: "Durée", align: "center", width: 90 },
      ];

      gantt.config.readonly = true;

      const tasks = {
        data: ListTask.filter(
          (task) => task.date_debut && task.date_limite
        ).map((task) => ({
          id: task.id,
          text: task.titre || "Sans titre",
          start_date: task.date_debut,
          duration: calculateDuration(task.date_debut, task.date_limite),
          progress: task.avancement ? task.avancement / 100 : 0,
        })),
      };

      gantt.init("gantt_here");
      gantt.parse(tasks);
    }
  }, [ListTask]);

  function calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end - start);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="font-bold">
        <FontAwesomeIcon icon={faChartGantt} className="mr-2 text-gray-500" />
        Diagramme de Gantt
      </h2>
      <div
        className="mt-2"
        id="gantt_here"
        style={{ width: "100%", height: "500px" }}
      ></div>
    </div>
  );
}
