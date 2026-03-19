import { Comment } from '../models/Comments';

// COMMENT SERVICE - Manages task comments and discussions
export class CommentService {
  private API_BASE_URL = 'http://localhost:3000';
  // array to save all comments locally
  private comments: Comment[] = [];
  // counter for generating unique comment IDs for tracking and deletion
  private idCounter = 1;

  // adds a new comment to a task with API integration
  async addComment(taskId: number, userId: number, message: string): Promise<Comment | null> {
    console.log('💬 Frontend: Adicionando comentário', { taskId, userId, message });
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message })
      });
      
      console.log('📡 Resposta da API:', response.status, response.ok);
      
      if (response.ok) {
        const newComment = await response.json();
        // Convert API format to local format
        const comment: Comment = {
          id: newComment.id,
          taskId: newComment.task_id,
          userId: newComment.user_id,
          message: newComment.message,
          createdAt: new Date(newComment.created_at || newComment.createdAt)
        };
        this.comments.push(comment);
        console.log('✅ Comentário criado na API:', comment);
        return comment;
      }
      
      console.error('❌ API retornou erro:', response.status);
      // Fallback: criar localmente
      const comment: Comment = {
        id: this.idCounter++,
        taskId,
        userId,
        message,
        createdAt: new Date()
      };
      this.comments.push(comment);
      console.log('📦 Modo offline: Comentário criado localmente:', comment);
      return comment;
    } catch (error) {
      console.error('⚠️ Erro ao criar comentário na API. A criar localmente...', error);
      // Fallback: criar localmente
      const comment: Comment = {
        id: this.idCounter++,
        taskId,
        userId,
        message,
        createdAt: new Date()
      };
      this.comments.push(comment);
      return comment;
    }
  }

  // retrieves all comments for a specific task - local only
  getComments(taskId: number): Comment[] {
    return this.comments.filter(c => c.taskId === taskId);
  }

  // loads comments from API for a specific task
  async loadComments(taskId: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/tasks/${taskId}/comments`);
      
      if (response.ok) {
        const apiComments = await response.json();
        // Convert API format to local format and merge
        apiComments.forEach((c: any) => {
          const comment: Comment = {
            id: c.id,
            taskId: c.task_id || c.taskId,
            userId: c.user_id || c.userId,
            message: c.message || c.conteudo,
            createdAt: new Date(c.created_at || c.createdAt)
          };
          // Only add if not already exists
          if (!this.comments.find(existing => existing.id === comment.id)) {
            this.comments.push(comment);
          }
        });
        console.log('✅ Comentários carregados da API:', apiComments.length);
      }
    } catch (error) {
      console.error('⚠️ Erro ao carregar comentários da API:', error);
    }
  }

  // removes a comment by ID
  deleteComment(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }
}
