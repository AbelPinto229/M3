import * as attachmentService from "../services/attachmentService.js";

export const getAttachmentsByTask = async (req, res) => {
  try {
    const attachments = await attachmentService.getAttachmentsByTask(Number(req.params.taskId));
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createAttachment = async (req, res) => {
  try {
    console.log('📝 Recebendo request para criar attachment:', req.body);
    const attachmentData = {
      task_id: Number(req.params.taskId),
      filename: req.body.filename,
      file_url: req.body.file_url || req.body.fileUrl || req.body.url,
      file_size: req.body.file_size || req.body.fileSize || req.body.size
    };
    console.log('📝 Dados do attachment processados:', attachmentData);
    const attachment = await attachmentService.createAttachment(attachmentData);
    res.status(201).json(attachment);
  } catch (error) {
    console.error('❌ Erro ao criar attachment:', error);
    res.status(500).json({ error: error.message });
  }
}

export const deleteAttachment = async (req, res) => {
  try {
    await attachmentService.deleteAttachment(Number(req.params.id));
    res.json({ message: "Attachment deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
