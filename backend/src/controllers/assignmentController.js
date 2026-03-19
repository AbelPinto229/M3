import * as assignmentService from "../services/assignmentService.js";

export const assignUserToTask = async (req, res) => {
  try {
    console.log('📝 Request para atribuir user:', req.body);
    const assignment = await assignmentService.assignUserToTask(
      Number(req.params.taskId),
      Number(req.body.user_id || req.body.userId)
    );
    res.status(201).json(assignment);
  } catch (error) {
    console.error('❌ Erro ao atribuir:', error);
    res.status(500).json({ error: error.message });
  }
}

export const getAssignmentsByTask = async (req, res) => {
  try {
    const assignments = await assignmentService.getAssignmentsByTask(Number(req.params.taskId));
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const removeAssignment = async (req, res) => {
  try {
    await assignmentService.removeAssignment(
      Number(req.params.taskId),
      Number(req.params.userId)
    );
    res.json({ message: "Atribuição removida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const clearTaskAssignments = async (req, res) => {
  try {
    await assignmentService.clearTaskAssignments(Number(req.params.taskId));
    res.json({ message: "Atribuições limpas com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
